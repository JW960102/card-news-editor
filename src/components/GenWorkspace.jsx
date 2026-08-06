import { useState, useRef, useEffect } from 'react'
import Stage from './Stage.jsx'
import { STYLES } from '../data/styles.js'
import { ARCHETYPES } from '../data/archetypes.js'
import { useHistory } from '../lib/useHistory.js'
import { saveDeck, exportDeck } from '../lib/store.js'
import { captureCard, downloadDataURL } from '../lib/exportCard.js'

// ② 작업창 — 생성된 뼈대를 요소 단위로 선택·드래그·리사이즈·편집. undo/redo 지원.
// (히스토리는 deck 교체 시 GenApp이 key로 remount → 자동 초기화)
const STAGE_W = 480
const ui = { fontFamily: 'sans-serif' }
const btn = (extra = {}) => ({ height: 34, padding: '0 14px', borderRadius: 8, border: '1px solid #ccc', background: '#fff', cursor: 'pointer', ...extra })
const pct = (v, total) => `${(v / total) * 100}%`

let uidc = 0
const newId = () => `el_u${Date.now()}_${uidc++}`

export default function GenWorkspace({ deck, onBack, onRegenerate }) {
  // 카드 문서를 히스토리로 관리 → undo/redo
  const { state: cards, set: setHist, undo, redo, canUndo, canRedo } = useHistory(deck.cards)
  const [cur, setCur] = useState(0)
  const [selId, setSelId] = useState(null)
  const [saved, setSaved] = useState(0)
  const [exporting, setExporting] = useState(false)
  const stageRef = useRef(null)
  const exportRefs = useRef({})
  const dragIdx = useRef(null)

  const canvas = deck.canvas
  const tokens = STYLES[deck.styleId]?.tokens || STYLES.stats.tokens
  const card = cards[Math.min(cur, cards.length - 1)]
  const sel = card?.elements.find((e) => e.id === selId) || null

  // ── 요소/카드 갱신 (tag: 같은 태그 연속 변경은 히스토리 1스텝으로 묶음) ──
  const updateEl = (id, patch, tag = null) =>
    setHist((cs) => cs.map((c, i) => i !== cur ? c : { ...c, elements: c.elements.map((e) => e.id === id ? { ...e, ...patch } : e) }), tag)
  const pushEl = (nel) => { setHist((cs) => cs.map((c, i) => i !== cur ? c : { ...c, elements: [...c.elements, nel] })); setSelId(nel.id) }
  const removeEl = (id) => { setHist((cs) => cs.map((c, i) => i !== cur ? c : { ...c, elements: c.elements.filter((e) => e.id !== id) })); setSelId(null) }

  const addText = () => pushEl({ id: newId(), type: 'text', x: Math.round(canvas.w / 2 - 300), y: Math.round(canvas.h / 2 - 40), w: 600, h: 80, size: 48, weight: 700, align: 'center', color: 'var(--card-ink)', font: 'display', lh: 1.2, content: '텍스트' })
  const addImage = () => pushEl({ id: newId(), type: 'image', x: Math.round(canvas.w / 2 - 300), y: Math.round(canvas.h / 2 - 225), w: 600, h: 450, radius: 20, fit: 'cover' })

  // 파일 → dataURL 로 이미지 요소에 삽입 (로컬, 업로드 없음)
  const pickImage = (id) => (ev) => {
    const file = ev.target.files?.[0]
    ev.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateEl(id, { src: reader.result })
    reader.readAsDataURL(file)
  }

  const addCard = () => { setHist((cs) => [...cs, { id: `card_u${Date.now()}`, archetype: 'card', elements: ARCHETYPES.card.build() }]); setCur(cards.length); setSelId(null) }
  const delCard = () => { if (cards.length <= 1) return; setHist((cs) => cs.filter((_, i) => i !== cur)); setCur((c) => Math.max(0, c - 1)); setSelId(null) }

  // ── 드래그 이동 / 리사이즈 (window 리스너로 캡처, 한 동작=1스텝) ──
  const startDrag = (e, el, mode) => {
    e.stopPropagation()
    setSelId(el.id)
    const box = stageRef.current.getBoundingClientRect()
    const sx = canvas.w / box.width, sy = canvas.h / box.height
    const x0 = el.x, y0 = el.y, w0 = el.w ?? 200, h0 = el.h ?? 80
    const tag = `${mode}:${el.id}`
    const move = (ev) => {
      const dx = (ev.clientX - e.clientX) * sx, dy = (ev.clientY - e.clientY) * sy
      if (mode === 'move') updateEl(el.id, { x: Math.round(x0 + dx), y: Math.round(y0 + dy) }, tag)
      else updateEl(el.id, { w: Math.max(40, Math.round(w0 + dx)), h: Math.max(30, Math.round(h0 + dy)) }, tag)
    }
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up)
  }

  // ── 저장 / 내보내기 ──
  const doSave = () => setSaved(saveDeck({ ...deck, cards }))
  const doExport = async () => {
    if (!stageRef.current) return
    try {
      const url = await captureCard(stageRef.current, { background: tokens['--card-bg'] })
      downloadDataURL(url, `${deck.id}-${cur + 1}.png`)
    } catch (err) { console.error('내보내기 실패', err); alert('내보내기 실패 — 콘솔 확인') }
  }
  // 전체 PNG — 숨김 1080 스테이지들을 카드별로 순차 캡처/다운로드
  const doExportAll = async () => {
    setExporting(true)
    try {
      for (let i = 0; i < cards.length; i++) {
        const el = exportRefs.current[i]
        if (!el) continue
        const url = await captureCard(el, { background: tokens['--card-bg'] })
        downloadDataURL(url, `${deck.id}-${i + 1}.png`)
      }
    } catch (err) { console.error('내보내기 실패', err); alert('내보내기 실패 — 콘솔 확인') }
    finally { setExporting(false) }
  }

  // ── 카드 순서 변경 (덱 썸네일 드래그) ──
  const reorder = (from, to) => {
    if (from == null || from === to) return
    setHist((cs) => { const n = [...cs]; const [m] = n.splice(from, 1); n.splice(to, 0, m); return n })
    setCur(to)
    dragIdx.current = null
  }

  // ── 키보드: Ctrl/Cmd+Z / Ctrl+Shift+Z(또는 Ctrl+Y) ──
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.ctrlKey || e.metaKey
      if (!mod) return
      const k = e.key.toLowerCase()
      if (k === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      else if ((k === 'z' && e.shiftKey) || k === 'y') { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  const hitH = (e) => e.h != null ? e.h : Math.round((e.size || 40) * (e.lh || 1.2) * 1.5)
  const hitW = (e) => e.w != null ? e.w : 240

  return (
    // height(=100%)로 고정한다. minHeight 면 내용이 넘칠 때 문서 자체가 늘어나
    // 바깥 스크롤바가 생긴다 — 안쪽 main/aside/footer 가 이미 각자 스크롤하므로 필요 없다.
    // (특히 iframe(포트폴리오 InApp 모달)에 띄울 때 바깥 스크롤이 거슬린다)
    <div style={{ height: '100%', overflow: 'hidden', background: '#ececed', ...ui, display: 'flex', flexDirection: 'column' }}>
      {/* 상단 툴바 */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', background: '#fff', borderBottom: '1px solid #e2e2e2' }}>
        <button onClick={onBack} style={btn()}>← 설정</button>
        <button onClick={onRegenerate} style={btn()}>🎲 다시 생성</button>
        <button onClick={undo} disabled={!canUndo} title="되돌리기 (Ctrl+Z)" style={btn({ opacity: canUndo ? 1 : 0.4 })}>↩</button>
        <button onClick={redo} disabled={!canRedo} title="다시 실행 (Ctrl+Shift+Z)" style={btn({ opacity: canRedo ? 1 : 0.4 })}>↪</button>
        <span style={{ fontSize: 14, fontWeight: 600, marginLeft: 6 }}>{STYLES[deck.styleId]?.label}</span>
        <div style={{ flex: 1 }} />
        <button onClick={addText} style={btn()}>+ 텍스트</button>
        <button onClick={addImage} style={btn()}>+ 이미지</button>
        {saved > 0 && <span style={{ fontSize: 13, color: '#2f8f4e' }}>저장됨 · 여태 {saved}개</span>}
        <button onClick={() => exportDeck({ ...deck, cards })} style={btn()}>JSON</button>
        <button onClick={doExport} disabled={exporting} style={btn()}>이 카드 PNG</button>
        <button onClick={doExportAll} disabled={exporting} style={btn()}>{exporting ? '저장 중…' : '전체 PNG'}</button>
        <button onClick={doSave} style={btn({ background: '#111', color: '#fff', border: 'none', fontWeight: 600 })}>저장</button>
      </header>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* 중앙 캔버스 */}
        <main style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 32, overflow: 'auto' }}>
          <div style={{ position: 'relative', width: STAGE_W, aspectRatio: `${canvas.w} / ${canvas.h}`, boxShadow: '0 10px 40px rgba(0,0,0,0.18)' }}>
            {/* 시각 레이어 (캡처 대상) */}
            <div ref={stageRef} style={{ position: 'absolute', inset: 0, ...tokens, containerType: 'inline-size', overflow: 'hidden', background: 'var(--card-bg)', color: 'var(--card-ink)', borderRadius: 4 }}>
              <Stage card={card} canvas={canvas} editable={false} />
            </div>
            {/* 상호작용 오버레이 */}
            <div style={{ position: 'absolute', inset: 0 }} onPointerDown={() => setSelId(null)}>
              {card?.elements.map((e) => {
                const selected = e.id === selId
                return (
                  <div key={e.id}
                    onPointerDown={(ev) => startDrag(ev, e, 'move')}
                    style={{ position: 'absolute', left: pct(e.x, canvas.w), top: pct(e.y, canvas.h), width: pct(hitW(e), canvas.w), height: pct(hitH(e), canvas.h), cursor: 'move', outline: selected ? '2px solid #2f6df6' : '1px dashed rgba(0,0,0,0.12)', outlineOffset: 0, boxSizing: 'border-box' }}>
                    {selected && (
                      <div onPointerDown={(ev) => startDrag(ev, e, 'resize')}
                        style={{ position: 'absolute', right: -6, bottom: -6, width: 12, height: 12, background: '#2f6df6', borderRadius: 2, cursor: 'nwse-resize' }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </main>

        {/* 우측 인스펙터 */}
        <aside style={{ width: 264, background: '#fff', borderLeft: '1px solid #e2e2e2', padding: 18, overflow: 'auto' }}>
          {!sel && <p style={{ fontSize: 13, color: '#999' }}>요소를 클릭해 선택하세요.</p>}
          {sel && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>{sel.type} 요소</div>
              {sel.type === 'text' && (
                <>
                  <Row label="내용">
                    <textarea value={sel.content} onChange={(ev) => updateEl(sel.id, { content: ev.target.value }, `content:${sel.id}`)}
                      style={{ width: '100%', minHeight: 64, padding: 8, borderRadius: 8, border: '1px solid #d5d5d5', fontSize: 13, boxSizing: 'border-box', resize: 'vertical' }} />
                  </Row>
                  <Row label="글자 크기">
                    <input type="number" value={sel.size} onChange={(ev) => updateEl(sel.id, { size: Number(ev.target.value) }, `size:${sel.id}`)} style={num} />
                  </Row>
                  <Row label="정렬">
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['left', 'center', 'right'].map((a) => (
                        <button key={a} onClick={() => updateEl(sel.id, { align: a })} style={btn({ flex: 1, height: 30, padding: 0, background: sel.align === a ? '#111' : '#fff', color: sel.align === a ? '#fff' : '#333' })}>{a === 'left' ? '좌' : a === 'center' ? '중' : '우'}</button>
                      ))}
                    </div>
                  </Row>
                </>
              )}
              {sel.type === 'image' && (
                <>
                  <Row label="이미지">
                    <label style={{ ...btn({ display: 'inline-flex', alignItems: 'center', width: '100%', justifyContent: 'center' }) }}>
                      {sel.src ? '이미지 교체' : '파일 선택'}
                      <input type="file" accept="image/*" onChange={pickImage(sel.id)} style={{ display: 'none' }} />
                    </label>
                  </Row>
                  {sel.src && (
                    <>
                      <Row label="맞춤">
                        <div style={{ display: 'flex', gap: 6 }}>
                          {['cover', 'contain'].map((f) => (
                            <button key={f} onClick={() => updateEl(sel.id, { fit: f })} style={btn({ flex: 1, height: 30, padding: 0, background: (sel.fit || 'cover') === f ? '#111' : '#fff', color: (sel.fit || 'cover') === f ? '#fff' : '#333' })}>{f === 'cover' ? '채우기' : '맞추기'}</button>
                          ))}
                        </div>
                      </Row>
                      <button onClick={() => updateEl(sel.id, { src: null })} style={btn({ background: '#fff0f0', border: '1px solid #f0c0c0', color: '#c0392b' })}>이미지 제거</button>
                    </>
                  )}
                </>
              )}
              <Row label="위치 X / Y">
                <div style={{ display: 'flex', gap: 6 }}>
                  <input type="number" value={Math.round(sel.x)} onChange={(ev) => updateEl(sel.id, { x: Number(ev.target.value) })} style={num} />
                  <input type="number" value={Math.round(sel.y)} onChange={(ev) => updateEl(sel.id, { y: Number(ev.target.value) })} style={num} />
                </div>
              </Row>
              <Row label="크기 W / H">
                <div style={{ display: 'flex', gap: 6 }}>
                  <input type="number" value={Math.round(sel.w ?? 0)} onChange={(ev) => updateEl(sel.id, { w: Number(ev.target.value) })} style={num} />
                  <input type="number" value={Math.round(sel.h ?? 0)} onChange={(ev) => updateEl(sel.id, { h: Number(ev.target.value) })} style={num} />
                </div>
              </Row>
              <button onClick={() => removeEl(sel.id)} style={btn({ background: '#fff0f0', border: '1px solid #f0c0c0', color: '#c0392b' })}>요소 삭제</button>
            </div>
          )}
        </aside>
      </div>

      {/* 하단 카드 덱 (드래그로 순서 변경) */}
      <footer style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: '#fff', borderTop: '1px solid #e2e2e2', overflowX: 'auto' }}>
        {cards.map((c, i) => (
          <button key={c.id} onClick={() => { setCur(i); setSelId(null) }}
            draggable
            onDragStart={() => { dragIdx.current = i }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => reorder(dragIdx.current, i)}
            title="드래그해서 순서 변경"
            style={{ padding: 0, border: i === cur ? '2px solid #2f6df6' : '1px solid #d5d5d5', borderRadius: 6, background: 'none', cursor: 'grab', flexShrink: 0 }}>
            <div style={{ ...tokens, width: 72, aspectRatio: `${canvas.w} / ${canvas.h}`, position: 'relative', overflow: 'hidden', borderRadius: 4, containerType: 'inline-size', background: 'var(--card-bg)', color: 'var(--card-ink)', pointerEvents: 'none' }}>
              <Stage card={c} canvas={canvas} editable={false} />
            </div>
          </button>
        ))}
        <button onClick={addCard} style={btn({ height: 40 })}>+ 카드</button>
        <button onClick={delCard} disabled={cards.length <= 1} style={btn({ height: 40 })}>− 카드</button>
      </footer>

      {/* 숨김 내보내기 레이어 — 전체 PNG용 1080 실측 스테이지 */}
      <div aria-hidden style={{ position: 'fixed', left: -99999, top: 0, pointerEvents: 'none' }}>
        {cards.map((c, i) => (
          <div key={c.id} ref={(el) => { exportRefs.current[i] = el }}
            style={{ ...tokens, width: canvas.w, height: canvas.h, position: 'relative', overflow: 'hidden', containerType: 'inline-size', background: 'var(--card-bg)', color: 'var(--card-ink)' }}>
            <Stage card={c} canvas={canvas} editable={false} />
          </div>
        ))}
      </div>
    </div>
  )
}

const num = { width: '100%', height: 32, padding: '0 8px', borderRadius: 8, border: '1px solid #d5d5d5', fontSize: 13, boxSizing: 'border-box' }
function Row({ label, children }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontSize: 12, color: '#777', marginBottom: 5 }}>{label}</span>
      {children}
    </label>
  )
}

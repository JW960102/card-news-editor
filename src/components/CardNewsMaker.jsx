import { useState, useRef, useEffect } from 'react'
import CardCanvas from './CardCanvas.jsx'
import DeckStrip from './DeckStrip.jsx'
import { TEMPLATES, TEMPLATE_IDS, makeCard } from '../data/templates.js'
import { THEMES, THEME_IDS } from '../data/themes.js'
import { captureCard, downloadDataURL } from '../lib/exportCard.js'
import { useHistory } from '../lib/useHistory.js'
import '../css/maker.css'

// 카드가 기본값 그대로인지(=아직 아무것도 안 고쳤는지) 판정
const isDefaultCard = (card) =>
  JSON.stringify(card.slots) === JSON.stringify(TEMPLATES[card.templateId].defaults)

export default function CardNewsMaker({ initialDeck, onRestart }) {
  // 문서(카드들 + 테마)를 히스토리로 관리 → undo/redo. 생성 플로우에서 넘어온 덱으로 시작.
  const { state: doc, set: setDoc, undo, redo, canUndo, canRedo } = useHistory(
    initialDeck || { cards: [makeCard('cover'), makeCard('body')], themeId: 'editorial' },
  )
  const cards = doc.cards
  const themeId = doc.themeId

  const [currentRaw, setCurrent] = useState(0)
  const [exporting, setExporting] = useState(false)
  const [confirmIndex, setConfirmIndex] = useState(null) // 삭제 확인 팝업 대상
  const cardRef = useRef(null)

  const current = Math.min(currentRaw, cards.length - 1)
  const card = cards[current]
  const theme = THEMES[themeId]
  const category = initialDeck?.category || '' // 카테고리 비주얼 스타일

  // ── 문서 갱신 헬퍼 ──
  const setCards = (updater, tag) =>
    setDoc((d) => ({ ...d, cards: typeof updater === 'function' ? updater(d.cards) : updater }), tag)
  const setThemeId = (id) => setDoc((d) => ({ ...d, themeId: id }))

  // ── 슬롯 편집 (같은 슬롯 연속 입력은 히스토리 1스텝으로 묶음) ──
  const setSlot = (key, value) =>
    setCards(
      (cs) => cs.map((c, i) => (i === current ? { ...c, slots: { ...c.slots, [key]: value } } : c)),
      `slot:${card.id}:${key}`,
    )

  // 레이아웃 변형 (현재 카드)
  const setVariant = (variant) =>
    setCards((cs) => cs.map((c, i) => (i === current ? { ...c, variant } : c)))

  // ── 카드 CRUD ──
  const addCard = () => {
    setCards((cs) => [...cs, makeCard('body')])
    setCurrent(cards.length)
  }
  const performDelete = (i) => {
    setCards((cs) => (cs.length === 1 ? cs : cs.filter((_, j) => j !== i)))
    setCurrent((c) => Math.max(0, Math.min(c, cards.length - 2)))
  }
  // 기본값 그대로면 즉시 삭제, 수정됐으면 확인 팝업
  const requestDelete = (i) => {
    if (cards.length === 1) return
    if (isDefaultCard(cards[i])) performDelete(i)
    else setConfirmIndex(i)
  }

  // ── 드래그 순서 변경 ──
  const reorderCard = (from, to) => {
    if (from === to || from == null || to == null) return
    setCards((cs) => {
      const next = [...cs]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
    setCurrent((c) => {
      if (c === from) return to
      if (from < c && to >= c) return c - 1
      if (from > c && to <= c) return c + 1
      return c
    })
  }

  // ── 템플릿 변경 (기존 내용 최대한 유지) ──
  const changeTemplate = (tid) => {
    const defaults = TEMPLATES[tid].defaults
    const cur = cards[current]
    const merged = {}
    for (const k in defaults) merged[k] = k in cur.slots ? cur.slots[k] : structuredClone(defaults[k])
    setCards((cs) => cs.map((c, i) => (i === current ? { ...c, templateId: tid, slots: merged } : c)))
  }

  // ── 내보내기 (현재 카드) ──
  const exportCurrent = async () => {
    if (!cardRef.current) return
    setExporting(true)
    try {
      const dataURL = await captureCard(cardRef.current, { background: theme.vars['--card-bg'] })
      downloadDataURL(dataURL, `card-${current + 1}.png`)
    } catch (e) {
      console.error('내보내기 실패', e)
      alert('내보내기에 실패했어요. 콘솔을 확인해주세요.')
    } finally {
      setExporting(false)
    }
  }

  // ── 키보드 단축키: Ctrl/Cmd+Z / Ctrl+Shift+Z(또는 Ctrl+Y) ──
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

  return (
    <div className="maker">
      {/* 상단 툴바 */}
      <header className="maker-topbar">
        <div className="maker-topbar-left">
          {onRestart && <button className="icon-btn" onClick={onRestart} title="새로 만들기">←</button>}
          <span className="maker-logo">Card News Editor</span>
        </div>
        <div className="maker-topbar-right">
          <button className="icon-btn" onClick={undo} disabled={!canUndo} title="되돌리기 (Ctrl+Z)">↩</button>
          <button className="icon-btn" onClick={redo} disabled={!canRedo} title="다시 실행 (Ctrl+Shift+Z)">↪</button>
          <button className="maker-export" onClick={exportCurrent} disabled={exporting}>
            {exporting ? '내보내는 중…' : '이 카드 PNG 저장'}
          </button>
        </div>
      </header>

      <div className="maker-body">
        {/* 좌측 컨트롤 */}
        <aside className="maker-panel">
          <section className="panel-group">
            <h3 className="panel-title">템플릿</h3>
            <div className="panel-btns">
              {TEMPLATE_IDS.map((tid) => (
                <button
                  key={tid}
                  className={'chip' + (card.templateId === tid ? ' active' : '')}
                  onClick={() => changeTemplate(tid)}
                >{TEMPLATES[tid].label}</button>
              ))}
            </div>
          </section>

          <section className="panel-group">
            <h3 className="panel-title">테마</h3>
            <div className="swatches">
              {THEME_IDS.map((id) => {
                const v = THEMES[id].vars
                return (
                  <button
                    key={id}
                    className={'swatch' + (themeId === id ? ' active' : '')}
                    onClick={() => setThemeId(id)}
                    title={THEMES[id].label}
                  >
                    <span className="swatch-chip" style={{ background: v['--card-bg'] }}>
                      <span className="swatch-dot" style={{ background: v['--card-accent'] }} />
                    </span>
                    <span className="swatch-label">{THEMES[id].label}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="panel-group">
            <h3 className="panel-title">레이아웃</h3>
            <div className="panel-btns">
              {[0, 1, 2].map((vi) => (
                <button
                  key={vi}
                  className={'chip' + ((card.variant || 0) === vi ? ' active' : '')}
                  onClick={() => setVariant(vi)}
                >{['기본', '변형 1', '변형 2'][vi]}</button>
              ))}
            </div>
          </section>
        </aside>

        {/* 중앙 캔버스 */}
        <main className="maker-stage">
          <CardCanvas card={card} theme={theme} category={category} onSlot={setSlot} cardRef={cardRef} />
        </main>
      </div>

      {/* 하단 덱 */}
      <DeckStrip
        cards={cards}
        currentIndex={current}
        theme={theme}
        category={category}
        onSelect={setCurrent}
        onAdd={addCard}
        onDelete={requestDelete}
        onReorder={reorderCard}
      />

      {/* 삭제 확인 팝업 */}
      {confirmIndex !== null && (
        <div className="modal-overlay" onClick={() => setConfirmIndex(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">이 카드를 삭제할까요?</p>
            <p className="modal-desc">수정한 내용이 있어요. 삭제해도 되돌리기(Ctrl+Z)로 복구할 수 있어요.</p>
            <div className="modal-actions">
              <button className="modal-btn" onClick={() => setConfirmIndex(null)}>취소</button>
              <button
                className="modal-btn danger"
                onClick={() => { performDelete(confirmIndex); setConfirmIndex(null) }}
              >삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { STYLES, STYLE_IDS } from '../data/styles.js'
import { ARCHETYPES, MID_TYPES } from '../data/archetypes.js'
import { loadAll, deleteSaved } from '../lib/store.js'
import { FONTS, FONT_IDS, DEFAULT_FONT } from '../data/fonts.js'
import { deckTokens } from '../lib/tokens.js'
import Stage from './Stage.jsx'

// ① 설정 — 좌측 작업 패널 (포토샵·피그마식).
// 전에는 전체 화면 설정 → 전체 화면 작업창으로 갈라져 있었는데,
// ⓐ 두 화면을 오가야 하고 ⓑ 작업창 좌우가 텅 비어 촌스럽다는 피드백을 받아
// 한 화면 안의 접히는 패널로 합쳤다. 초안을 만들면 스스로 접히고, 버튼으로 다시 펼친다.
const ui = { fontFamily: 'sans-serif' }
const PANEL_W = 288
const RAIL_W = 44

const chip = (on) => ({
  height: 34, padding: '0 12px', borderRadius: 999,
  border: '1px solid ' + (on ? '#111' : '#d5d5d5'),
  background: on ? '#111' : '#fff', color: on ? '#fff' : '#333',
  fontWeight: 500, fontSize: 13, cursor: 'pointer',
})

export default function GenSetup({ open, onToggle, onGenerate, onOpen, deckFontId, onDeckFontChange }) {
  const [title, setTitle] = useState('')
  const [count, setCount] = useState(5)
  const [styleId, setStyleId] = useState('stats')
  const [fontId, setFontId] = useState(DEFAULT_FONT)
  const [types, setTypes] = useState(['card', 'bar'])
  const [saved, setSaved] = useState(() => loadAll())

  const toggleType = (t) =>
    setTypes((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]))
  const remove = (e, id) => { e.stopPropagation(); setSaved(deleteSaved(id)) }

  // 접힌 상태 — 얇은 레일만 남긴다 (사라지면 다시 부를 방법이 없다)
  if (!open) {
    return (
      <div style={{ width: RAIL_W, flex: 'none', background: '#fff', borderRight: '1px solid #e2e2e2', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12, ...ui }}>
        <button onClick={onToggle} title="설정 패널 열기"
          style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontSize: 14 }}>▸</button>
        <span style={{ marginTop: 12, fontSize: 11, color: '#888', writingMode: 'vertical-rl', letterSpacing: '0.1em' }}>설정</span>
      </div>
    )
  }

  return (
    <div style={{ width: PANEL_W, flex: 'none', background: '#fff', borderRight: '1px solid #e2e2e2', display: 'flex', flexDirection: 'column', ...ui }}>
      <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 8, height: 58, padding: '0 10px 0 16px', borderBottom: '1px solid #eee' }}>
        <strong style={{ flex: 1, fontSize: 14 }}>카드뉴스 초안</strong>
        <button onClick={onToggle} title="패널 접기"
          style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontSize: 14 }}>◂</button>
      </div>

      {/* 패널이 길어지면 여기서만 스크롤 — 바깥 문서는 절대 늘어나지 않는다 */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 16 }}>
        <Field label="주제 / 제목">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 2분기 판매 리포트"
            style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #d5d5d5', fontSize: 14, boxSizing: 'border-box' }} />
        </Field>

        <Field label="카드 수">
          <div style={{ display: 'flex', gap: 6 }}>
            {[3, 4, 5, 6, 7].map((n) => (
              <button key={n} onClick={() => setCount(n)}
                style={{ flex: 1, height: 36, borderRadius: 8, border: '1px solid ' + (count === n ? '#111' : '#d5d5d5'), background: count === n ? '#111' : '#fff', color: count === n ? '#fff' : '#333', fontWeight: 600, cursor: 'pointer' }}>{n}</button>
            ))}
          </div>
        </Field>

        <Field label="스타일">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {STYLE_IDS.map((id) => (
              <button key={id} onClick={() => setStyleId(id)} style={chip(styleId === id)}>{STYLES[id].label}</button>
            ))}
          </div>
        </Field>

        {/* 칩 자체를 그 폰트로 그려서 고르기 전에 생김새를 보여 준다.
            이미 만든 덱이 있으면 누르는 즉시 그 덱에 반영한다 (다시 만들 필요 없음). */}
        <Field label="폰트 세트">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FONT_IDS.map((id) => (
              <button key={id}
                onClick={() => { setFontId(id); if (deckFontId && onDeckFontChange) onDeckFontChange(id) }}
                style={{ ...chip((deckFontId || fontId) === id), fontFamily: FONTS[id].tokens['--font-display'] }}>
                {FONTS[id].sample} {FONTS[id].label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="중간 카드 레이아웃 (표지·마무리는 자동)">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {MID_TYPES.map((t) => (
              <button key={t} onClick={() => toggleType(t)} style={chip(types.includes(t))}>{ARCHETYPES[t].label}</button>
            ))}
          </div>
        </Field>

        {saved.length > 0 && (
          <div style={{ marginTop: 28, borderTop: '1px solid #eee', paddingTop: 18 }}>
            <span style={{ display: 'block', fontSize: 13, color: '#555', marginBottom: 10 }}>저장한 작업 · {saved.length}개</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {saved.map((deck) => {
                const tokens = deckTokens(deck)
                const cover = deck.cards?.[0]
                return (
                  <div key={deck.id} onClick={() => onOpen(deck)} style={{ cursor: 'pointer' }}>
                    <div style={{ ...tokens, width: '100%', aspectRatio: `${deck.canvas.w} / ${deck.canvas.h}`, position: 'relative', overflow: 'hidden', borderRadius: 6, boxShadow: '0 3px 12px rgba(0,0,0,0.12)', containerType: 'inline-size', background: 'var(--card-bg)', color: 'var(--card-ink)' }}>
                      {cover && <Stage card={cover} canvas={deck.canvas} editable={false} />}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: '#888' }}>{STYLES[deck.styleId]?.label} · {deck.cards?.length}장</span>
                      <button onClick={(e) => remove(e, deck.id)} title="삭제" style={{ border: 'none', background: 'none', color: '#c0392b', cursor: 'pointer', fontSize: 12, padding: 0 }}>✕</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div style={{ flex: 'none', padding: 16, borderTop: '1px solid #eee' }}>
        <button onClick={() => onGenerate({ title, count, styleId, fontId, types: types.length ? types : MID_TYPES })}
          style={{ width: '100%', height: 46, borderRadius: 10, background: '#111', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
          초안 만들기 →
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 18 }}>
      <span style={{ display: 'block', fontSize: 12, color: '#555', marginBottom: 7 }}>{label}</span>
      {children}
    </label>
  )
}

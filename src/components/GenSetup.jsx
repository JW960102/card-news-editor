import { useState } from 'react'
import { STYLES, STYLE_IDS } from '../data/styles.js'
import { ARCHETYPES, MID_TYPES } from '../data/archetypes.js'
import { loadAll, deleteSaved } from '../lib/store.js'
import Stage from './Stage.jsx'

// ① 설정 — [장수 · 스타일 · 레이아웃 타입] 정하면 초안 생성. + 저장한 작업 불러오기.
const ui = { fontFamily: 'sans-serif' }
const chip = (on) => ({ height: 40, padding: '0 16px', borderRadius: 999, border: '1px solid ' + (on ? '#111' : '#d5d5d5'), background: on ? '#111' : '#fff', color: on ? '#fff' : '#333', fontWeight: 500, cursor: 'pointer' })

export default function GenSetup({ onGenerate, onOpen }) {
  const [title, setTitle] = useState('')
  const [count, setCount] = useState(5)
  const [styleId, setStyleId] = useState('stats')
  const [types, setTypes] = useState(['card', 'bar'])
  const [saved, setSaved] = useState(() => loadAll())

  const toggleType = (t) =>
    setTypes((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]))
  const remove = (e, id) => { e.stopPropagation(); setSaved(deleteSaved(id)) }

  return (
    // 화면 가운데로 모은다. 왼쪽에 붙여 두면 넓은 화면에서 한쪽으로 쏠려 보인다.
    <div style={{ minHeight: '100%', background: '#f4f4f5', padding: 40, ...ui, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 520, textAlign: 'center' }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 6 }}>카드뉴스 초안 만들기</h1>
        <p style={{ color: '#666', marginBottom: 32, fontSize: 14 }}>몇 가지만 고르면 레이아웃·텍스트·그래프가 놓인 초안을 만들어드려요. 세부는 직접 다듬으면 돼요.</p>

        <Field label="주제 / 제목">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 2분기 판매 리포트"
            style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 10, border: '1px solid #d5d5d5', fontSize: 15, boxSizing: 'border-box' }} />
        </Field>

        <Field label="카드 수">
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {[3, 4, 5, 6, 7].map((n) => (
              <button key={n} onClick={() => setCount(n)} style={{ width: 46, height: 42, borderRadius: 10, border: '1px solid ' + (count === n ? '#111' : '#d5d5d5'), background: count === n ? '#111' : '#fff', color: count === n ? '#fff' : '#333', fontWeight: 600, cursor: 'pointer' }}>{n}</button>
            ))}
          </div>
        </Field>

        <Field label="스타일">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {STYLE_IDS.map((id) => (
              <button key={id} onClick={() => setStyleId(id)} style={chip(styleId === id)}>{STYLES[id].label}</button>
            ))}
          </div>
        </Field>

        <Field label="중간 카드 레이아웃 (복수 선택 · 표지·마무리는 자동)">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {MID_TYPES.map((t) => (
              <button key={t} onClick={() => toggleType(t)} style={chip(types.includes(t))}>{ARCHETYPES[t].label}</button>
            ))}
          </div>
        </Field>

        <button onClick={() => onGenerate({ title, count, styleId, types: types.length ? types : MID_TYPES })}
          style={{ marginTop: 12, height: 50, padding: '0 28px', borderRadius: 12, background: '#111', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
          초안 만들기 →
        </button>
      </div>

      {saved.length > 0 && (
        <div style={{ marginTop: 48, width: '100%', maxWidth: 820, textAlign: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>저장한 작업 · {saved.length}개</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center' }}>
            {saved.map((deck) => {
              const tokens = STYLES[deck.styleId]?.tokens || STYLES.stats.tokens
              const cover = deck.cards?.[0]
              return (
                <div key={deck.id} onClick={() => onOpen(deck)} style={{ cursor: 'pointer', position: 'relative' }}>
                  <div style={{ ...tokens, width: 120, aspectRatio: `${deck.canvas.w} / ${deck.canvas.h}`, position: 'relative', overflow: 'hidden', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', containerType: 'inline-size', background: 'var(--card-bg)', color: 'var(--card-ink)' }}>
                    {cover && <Stage card={cover} canvas={deck.canvas} editable={false} />}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 120, marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: '#888' }}>{STYLES[deck.styleId]?.label} · {deck.cards?.length}장</span>
                    <button onClick={(e) => remove(e, deck.id)} title="삭제" style={{ border: 'none', background: 'none', color: '#c0392b', cursor: 'pointer', fontSize: 13, padding: 2 }}>✕</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 24 }}>
      <span style={{ display: 'block', fontSize: 13, color: '#555', marginBottom: 8 }}>{label}</span>
      {children}
    </label>
  )
}

import { useState, useEffect } from 'react'
import Stage from './Stage.jsx'
import { STYLES } from '../data/styles.js'
import { ARCHETYPES } from '../data/archetypes.js'
import { saveDeck, exportDeck } from '../lib/store.js'

// ② 편집 — 생성된 뼈대의 텍스트를 그 자리에서 수정 + 저장.
//    (드래그·리사이즈·PNG 삽입은 다음 단계)
const ui = { fontFamily: 'sans-serif' }

export default function GenEditor({ deck, onBack, onRegenerate }) {
  const [cards, setCards] = useState(deck.cards)
  const [saved, setSaved] = useState(0)
  useEffect(() => { setCards(deck.cards) }, [deck])

  const tokens = STYLES[deck.styleId]?.tokens || STYLES.stats.tokens
  const ar = `${deck.canvas.w} / ${deck.canvas.h}`

  const onText = (ci) => (elId, value) =>
    setCards((cs) => cs.map((c, i) => i !== ci ? c : {
      ...c, elements: c.elements.map((e) => e.id === elId ? { ...e, content: value } : e),
    }))

  const doSave = () => {
    const n = saveDeck({ ...deck, cards })
    setSaved(n)
  }

  return (
    <div style={{ minHeight: '100%', background: '#f4f4f5', padding: 32, ...ui }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <button onClick={onBack} style={btn()}>← 설정</button>
        <button onClick={onRegenerate} style={btn()}>🎲 다시 생성</button>
        <h2 style={{ fontSize: 17, fontWeight: 500, flex: 1 }}>{STYLES[deck.styleId]?.label} · {cards.length}장</h2>
        {saved > 0 && <span style={{ fontSize: 13, color: '#2f8f4e' }}>저장됨 · 여태 {saved}개 쌓임</span>}
        <button onClick={() => exportDeck({ ...deck, cards })} style={btn()}>JSON</button>
        <button onClick={doSave} style={{ ...btn(), background: '#111', color: '#fff', border: 'none', fontWeight: 600 }}>저장</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
        {cards.map((card, i) => (
          <div key={card.id}>
            <div style={{ ...tokens, width: 320, aspectRatio: ar, position: 'relative', overflow: 'hidden', borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.14)', containerType: 'inline-size', background: 'var(--card-bg)', color: 'var(--card-ink)' }}>
              <Stage card={card} canvas={deck.canvas} editable onText={onText(i)} />
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>{ARCHETYPES[card.archetype]?.label || card.archetype}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const btn = () => ({ height: 34, padding: '0 14px', borderRadius: 8, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' })

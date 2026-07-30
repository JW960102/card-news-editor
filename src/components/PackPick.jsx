import { PACKS } from '../data/packs.js'
import PackCard from './PackCard.jsx'

// ③ 시안 고르기 — 조합으로 만든 후보 덱들을 썸네일로 보여주고 하나 선택.
const ASPECT = { '4:5': '4 / 5', '1:1': '1 / 1' }
const ui = { fontFamily: 'sans-serif' }

export default function PackPick({ packId, candidates, onBack, onRegenerate, onPick }) {
  const pack = PACKS[packId]
  if (!pack) return null
  const ar = ASPECT[pack.aspect] || '4 / 5'

  return (
    <div style={{ minHeight: '100%', background: '#f4f4f5', padding: 32, ...ui }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
        <button onClick={onBack} style={{ height: 32, padding: '0 14px', borderRadius: 8, border: '0.5px solid #ccc', background: '#fff' }}>← 설정</button>
        <h2 style={{ fontSize: 18, fontWeight: 500, flex: 1 }}>마음에 드는 시안을 고르세요</h2>
        <button onClick={onRegenerate} style={{ height: 34, padding: '0 16px', borderRadius: 8, border: '0.5px solid #ccc', background: '#fff', fontWeight: 500 }}>🎲 다시 조합</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {candidates.map((cand) => (
          <button key={cand.id} onClick={() => onPick(cand)}
            style={{ background: '#fff', border: '0.5px solid #e2e2e2', borderRadius: 12, padding: 14, cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {cand.cards.map((card) => (
                <div key={card.id}
                  style={{ ...pack.tokens, width: 96, aspectRatio: ar, position: 'relative', overflow: 'hidden', borderRadius: 6, flexShrink: 0, containerType: 'inline-size', background: 'var(--card-bg)', color: 'var(--card-ink)' }}>
                  <PackCard packId={packId} card={card} onSlot={() => {}} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: '#555' }}>{cand.cards.length}장 · {cand.recipeLabel}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

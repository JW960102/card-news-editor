import { useState, useEffect, useRef } from 'react'
import { PACKS, PACK_IDS } from '../data/packs.js'
import PackCard from './PackCard.jsx'
import { defaultDeck } from '../lib/packEngine.js'
import { captureCard, downloadDataURL } from '../lib/exportCard.js'

// ④ 편집/내보내기 — 조합으로 고른 덱(deck)을 받아 텍스트 편집 + PNG 저장.
//    deck 없이 진입(?pack=xxx 직접)하면 팩 블록 1장씩 기본 덱을 만든다.
const ASPECT = { '4:5': '4 / 5', '1:1': '1 / 1' }
const ui = { fontFamily: 'sans-serif' }

const cardStyleFor = (aspect) => ({
  width: 340,
  aspectRatio: ASPECT[aspect] || '4 / 5',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 8,
  boxShadow: '0 8px 30px rgba(0,0,0,0.14)',
  containerType: 'inline-size',
  flexShrink: 0,
})

export default function PackPreview({ packId = 'mint', deck, onBack }) {
  const pid = packId in PACKS ? packId : PACK_IDS[0]
  const pack = PACKS[pid]
  const [cards, setCards] = useState([])
  const [busy, setBusy] = useState(false)
  const refs = useRef({})

  useEffect(() => {
    const source = deck && deck.cards ? deck : defaultDeck(pid)
    setCards(source.cards.map((c) => structuredClone(c)))
    refs.current = {}
  }, [pid, deck])

  if (!pack) return <div style={{ padding: 40, ...ui }}>알 수 없는 팩: {pid}</div>

  const setSlot = (i) => (k, v) =>
    setCards((cs) => cs.map((c, j) => (j === i ? { ...c, slots: { ...c.slots, [k]: v } } : c)))

  const exportOne = async (i) => {
    const el = refs.current[i]
    if (!el) return
    setBusy(true)
    try {
      const url = await captureCard(el, { background: pack.tokens['--card-bg'] })
      downloadDataURL(url, `${pid}-${i + 1}.png`)
    } catch (e) { console.error('내보내기 실패', e); alert('내보내기 실패 — 콘솔 확인') }
    finally { setBusy(false) }
  }
  const exportAll = async () => { for (let i = 0; i < cards.length; i++) await exportOne(i) }

  return (
    <div style={{ minHeight: '100%', background: '#f4f4f5', padding: 32, ...ui }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        {onBack && <button onClick={onBack} style={{ height: 32, padding: '0 14px', borderRadius: 8, border: '0.5px solid #ccc', background: '#fff' }}>← 시안</button>}
        <h2 style={{ fontSize: 18, fontWeight: 500, flex: 1 }}>편집 — {pack.label} ({pack.aspect}) · {cards.length}장</h2>
        <button onClick={exportAll} disabled={busy} style={{ height: 34, padding: '0 16px', borderRadius: 8, background: '#111', color: '#fff', border: 'none', fontWeight: 500 }}>
          {busy ? '저장 중…' : '전체 PNG 저장'}
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
        {cards.map((card, i) => (
          <div key={card.id}>
            <div ref={(el) => { refs.current[i] = el }} style={{ ...pack.tokens, ...cardStyleFor(pack.aspect), background: 'var(--card-bg)', color: 'var(--card-ink)' }}>
              <PackCard packId={pid} card={card} onSlot={setSlot(i)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, width: 340 }}>
              <span style={{ fontSize: 13, color: '#666' }}>{card.role || card.templateId}</span>
              <button onClick={() => exportOne(i)} disabled={busy} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, border: '0.5px solid #ccc', background: '#fff' }}>PNG</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

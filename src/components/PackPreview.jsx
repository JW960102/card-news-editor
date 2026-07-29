import { useState, useEffect, useRef } from 'react'
import { PACKS, PACK_IDS } from '../data/packs.js'
import MintCard from './packs/mint.jsx'
import { captureCard, downloadDataURL } from '../lib/exportCard.js'

// 팩 편집/내보내기 화면. ?pack=mint 로 진입. (팩 추가되면 아래 map에 등록만)
const PACK_COMPONENTS = { mint: MintCard }

const cardStyle = {
  width: 340,
  aspectRatio: '4 / 5',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 8,
  boxShadow: '0 8px 30px rgba(0,0,0,0.14)',
  containerType: 'inline-size',
  flexShrink: 0,
}
const ui = { fontFamily: 'sans-serif' }

export default function PackPreview({ packId = 'mint' }) {
  const [pid, setPid] = useState(packId in PACKS ? packId : PACK_IDS[0])
  const [cards, setCards] = useState([])
  const [busy, setBusy] = useState(false)
  const refs = useRef({})

  const pack = PACKS[pid]
  const Comp = PACK_COMPONENTS[pid]

  useEffect(() => {
    setCards(pack.templates.map((t) => ({ templateId: t, slots: structuredClone(pack.defaults[t]) })))
    refs.current = {}
  }, [pid])

  if (!pack || !Comp) return <div style={{ padding: 40, ...ui }}>알 수 없는 팩: {pid}</div>

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
        <h2 style={{ fontSize: 18, fontWeight: 500 }}>팩 편집 — {pack.label} ({pack.aspect})</h2>
        <select value={pid} onChange={(e) => setPid(e.target.value)} style={{ height: 32, borderRadius: 8 }}>
          {PACK_IDS.map((id) => <option key={id} value={id}>{PACKS[id].label}</option>)}
        </select>
        <button onClick={exportAll} disabled={busy} style={{ height: 34, padding: '0 16px', borderRadius: 8, background: '#111', color: '#fff', border: 'none', fontWeight: 500 }}>
          {busy ? '저장 중…' : '전체 PNG 저장'}
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
        {cards.map((card, i) => (
          <div key={i}>
            <div ref={(el) => { refs.current[i] = el }} style={{ ...pack.tokens, ...cardStyle, background: 'var(--card-bg)', color: 'var(--card-ink)' }}>
              <Comp card={card} onSlot={setSlot(i)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, width: 340 }}>
              <span style={{ fontSize: 13, color: '#666' }}>{card.templateId}</span>
              <button onClick={() => exportOne(i)} disabled={busy} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, border: '0.5px solid #ccc', background: '#fff' }}>PNG</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

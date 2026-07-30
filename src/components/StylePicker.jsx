import { PACKS, PACK_IDS } from '../data/packs.js'
import PackCard from './PackCard.jsx'

const ASPECT = { '4:5': '4 / 5', '1:1': '1 / 1' }

// ① 스타일(팩) 선택 화면 — 팩마다 표지(opener) 미리보기
export default function StylePicker({ onPick }) {
  return (
    <div style={{ minHeight: '100%', background: '#f4f4f5', padding: 40, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 6 }}>스타일 고르기</h1>
      <p style={{ color: '#666', marginBottom: 28, fontSize: 14 }}>원하는 스타일을 고르면 그 디자인 블록들을 조합해 카드뉴스를 만들어요.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
        {PACK_IDS.map((id) => {
          const pack = PACKS[id]
          const openerId = pack.roleplan?.opener || Object.keys(pack.blocks)[0]
          const cover = { id: `pv_${id}`, templateId: openerId, slots: structuredClone(pack.blocks[openerId].defaults) }
          const blockCount = Object.keys(pack.blocks).length
          return (
            <button key={id} onClick={() => onPick(id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'center' }}>
              <div style={{
                ...pack.tokens, width: 220, aspectRatio: ASPECT[pack.aspect] || '4 / 5',
                position: 'relative', overflow: 'hidden', borderRadius: 10,
                boxShadow: '0 8px 30px rgba(0,0,0,0.14)', containerType: 'inline-size',
                background: 'var(--card-bg)', color: 'var(--card-ink)',
                transition: 'transform 0.12s ease',
              }}>
                <PackCard packId={id} card={cover} onSlot={() => {}} />
              </div>
              <div style={{ marginTop: 10, fontSize: 15, fontWeight: 500 }}>{pack.label}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{pack.aspect} · 블록 {blockCount}종</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

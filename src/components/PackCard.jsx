import MintCard from './packs/mint.jsx'
import SkyCard from './packs/sky.jsx'

// 팩 렌더 디스패처 — packId 로 블록 컴포넌트 선택. (팩 추가 시 여기 한 줄만)
const PACK_COMPONENTS = { mint: MintCard, sky: SkyCard }

export default function PackCard({ packId, card, onSlot }) {
  const Comp = PACK_COMPONENTS[packId]
  if (!Comp) return null
  return <Comp card={card} onSlot={onSlot} />
}

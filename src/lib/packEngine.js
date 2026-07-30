import { PACKS } from '../data/packs.js'

// ┌ 팩 조합 엔진 (AI 없음, 결정론 아님 = 랜덤 조합) ────────────────────┐
// │ 한 팩 "안"에서 블록을 재조합해 후보 덱 N개를 만든다.                │
// │ 다양성 = (mid 역할 순서/선택) × (역할 바구니 안 블록 선택).          │
// │ 바구니에 블록이 늘수록 조합 수가 곱셈으로 커진다 — 엔진은 그대로.    │
// └────────────────────────────────────────────────────────────────────┘

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// role → 그 역할을 가진 blockId 배열 (= 바구니). 등록 순서 유지.
export function bucketsOf(pack) {
  const map = {}
  for (const [blockId, def] of Object.entries(pack.blocks)) {
    ;(map[def.role] ||= []).push(blockId)
  }
  return map
}

// opener / closer 를 뺀 나머지 역할 = mid 역할들
export function midRolesOf(pack) {
  const { opener, closer } = pack.roleplan || {}
  const roles = [...new Set(Object.values(pack.blocks).map((b) => b.role))]
  return roles.filter((r) => r !== opener && r !== closer)
}

// count 장짜리 "역할 시퀀스" 하나. offset 으로 후보마다 mid 순서를 회전.
function buildRoleSequence(pack, count, offset) {
  const { opener, closer } = pack.roleplan || {}
  const seq = []
  let remaining = count
  if (opener) { seq.push(opener); remaining-- }
  const reserveCloser = closer ? 1 : 0
  const midSlots = Math.max(0, remaining - reserveCloser)

  const mids = midRolesOf(pack)
  if (mids.length) {
    // 후보마다 다른 시작점 + 셔플로 순서/구성을 변주
    const rotated = shuffle(mids)
    for (let i = 0; i < midSlots; i++) seq.push(rotated[(i + offset) % rotated.length])
  }
  if (closer) seq.push(closer)
  return seq
}

let uid = 0
// 역할 → 그 바구니에서 블록 하나 뽑기 (후보/위치마다 다르게 → 블록 다양성)
function pickBlock(buckets, role, salt) {
  const bucket = buckets[role] || [role]
  return bucket[(salt + Math.floor(Math.random() * bucket.length)) % bucket.length]
}

// 카드 1장 = { id, role, templateId(=blockId), slots }
function makeCard(pack, blockId, role) {
  const def = pack.blocks[blockId] || {}
  return {
    id: `pc_${Date.now()}_${uid++}`,
    role,
    templateId: blockId, // 팩 렌더 컴포넌트가 이 값으로 분기
    slots: structuredClone(def.defaults || {}),
  }
}

// brief { title, count } → 후보 덱 n개
export function generatePackDecks(packId, brief = {}, n = 4) {
  const pack = PACKS[packId]
  if (!pack) return []
  const { title = '', count = 5 } = brief
  const buckets = bucketsOf(pack)
  const { opener } = pack.roleplan || {}

  return Array.from({ length: n }, (_, cand) => {
    const roleSeq = buildRoleSequence(pack, count, cand)
    const cards = roleSeq.map((role, pos) => {
      const blockId = pickBlock(buckets, role, cand + pos)
      const card = makeCard(pack, blockId, role)
      // 표지에 사용자 제목 주입 (opener 역할, title 슬롯이 있을 때만)
      if (role === opener && title.trim() && 'title' in card.slots) {
        card.slots.title = title.trim()
      }
      return card
    })
    return {
      id: `deck_${Date.now()}_${cand}`,
      packId,
      cards,
      recipeLabel: roleSeq.join(' · '),
    }
  })
}

// ?pack=xxx 직접 진입용: 팩 블록을 등록 순서대로 1장씩 (기존 미리보기 성격)
export function defaultDeck(packId) {
  const pack = PACKS[packId]
  if (!pack) return { id: 'deck_empty', packId, cards: [], recipeLabel: '' }
  const cards = Object.keys(pack.blocks).map((blockId) =>
    makeCard(pack, blockId, pack.blocks[blockId].role),
  )
  return { id: `deck_${Date.now()}`, packId, cards, recipeLabel: cards.map((c) => c.role).join(' · ') }
}

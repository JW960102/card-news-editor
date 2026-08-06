import { CANVAS, STYLES } from '../data/styles.js'
import { FONTS, DEFAULT_FONT } from '../data/fonts.js'
import { ARCHETYPES, MID_TYPES } from '../data/archetypes.js'

// ┌ 스캐폴드 생성 엔진 (AI 없음) ────────────────────────────────────────┐
// │ 입력 [장수 · 스타일 · 레이아웃타입] → 카드덱(요소배열) 을 "계산 생성".│
// │ 표지 + 중간(고른 타입들 회전) + 마무리 로 구성.                       │
// └─────────────────────────────────────────────────────────────────────┘

let deckSeq = 0

// 중간 카드 타입 시퀀스: 고른 타입들을 count-2 개만큼 회전 배치
function midSequence(types, midCount) {
  const pool = types && types.length ? types : MID_TYPES
  return Array.from({ length: Math.max(0, midCount) }, (_, i) => pool[i % pool.length])
}

// brief { count, styleId, fontId, types } → deck
export function generateScaffold(brief = {}) {
  const { count = 5, styleId = 'stats', fontId = DEFAULT_FONT, types = MID_TYPES, title = '' } = brief
  const style = STYLES[styleId] ? styleId : 'stats'
  const font = FONTS[fontId] ? fontId : DEFAULT_FONT

  const seq = ['title', ...midSequence(types, count - 2), 'closing'].slice(0, Math.max(1, count))
  // count 가 1~2 여도 최소 표지는 유지
  if (seq.length < count) seq.push('closing')

  const cards = seq.map((archetype) => {
    const def = ARCHETYPES[archetype] || ARCHETYPES.card
    const elements = def.build().map((e) => ({ ...e }))
    // 표지에 사용자 제목 주입
    if (archetype === 'title' && title.trim()) {
      const t = elements.find((el) => el.type === 'text')
      if (t) t.content = title.trim()
    }
    return { id: `card_${deckSeq}_${Math.random().toString(36).slice(2, 7)}`, archetype, elements }
  })

  return {
    id: `deck_${Date.now()}_${deckSeq++}`,
    styleId: style,
    fontId: font,
    canvas: { ...CANVAS },
    cards,
    createdAt: new Date().toISOString(),
  }
}

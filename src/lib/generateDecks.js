import { makeCard } from '../data/templates.js'
import { CATEGORIES, CATEGORY_IDS } from '../data/recipes.js'
import { CATEGORY_COPY } from '../data/copy.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 테마 풀에서 n개 (가능하면 서로 다르게, 부족하면 순환)
function pickThemes(pool, n) {
  const shuffled = shuffle(pool)
  return Array.from({ length: n }, (_, i) => shuffled[i % shuffled.length])
}

// 표지 + 중간(mid) + 마무리(cta). offset으로 후보마다 순서 살짝 변주.
function buildSequence(mid, count, offset) {
  const seq = ['cover']
  const midCount = Math.max(1, count - 2)
  for (let i = 0; i < midCount; i++) seq.push(mid[(i + offset) % mid.length])
  seq.push('cta')
  return seq
}

// 브리프 → 후보 덱 n개 (결정론적, AI 없음)
// style === 'auto' → 후보마다 다른 카테고리 / 특정 style → 그 카테고리 안에서 테마·변형만 다르게
export function generateDecks(brief, n = 4) {
  const { title = '', count = 5, style = 'auto' } = brief || {}
  const variants = shuffle([0, 1, 2])

  let specs // [{ catId, themeId }]
  if (style === 'auto') {
    const cats = shuffle(CATEGORY_IDS)
    specs = Array.from({ length: n }, (_, i) => {
      const catId = cats[i % cats.length]
      const pool = CATEGORIES[catId].themes
      return { catId, themeId: pool[Math.floor(Math.random() * pool.length)] }
    })
  } else {
    const cat = CATEGORIES[style] || CATEGORIES.business
    specs = pickThemes(cat.themes, n).map((themeId) => ({ catId: style, themeId }))
  }

  return specs.map((sp, idx) => {
    const cat = CATEGORIES[sp.catId]
    const variant = variants[idx % variants.length]
    const seq = buildSequence(cat.mid, count, idx)
    const copy = CATEGORY_COPY[sp.catId] || {}
    const cards = seq.map((tid) => {
      const c = makeCard(tid, variant)
      if (copy[tid]) c.slots = structuredClone(copy[tid]) // 카테고리 톤 카피 주입
      if (tid === 'cover' && title.trim()) c.slots.title = title.trim()
      return c
    })
    return { id: `cand_${Date.now()}_${idx}`, themeId: sp.themeId, category: sp.catId, cards, recipeLabel: cat.label }
  })
}

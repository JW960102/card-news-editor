import { makeCard } from '../data/templates.js'
import { THEME_IDS } from '../data/themes.js'
import { RECIPES, MOOD_THEMES } from '../data/recipes.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 후보 개수만큼 테마를 고름 (가능하면 서로 다르게, 부족하면 순환)
function pickThemes(pool, n) {
  const base = pool && pool.length ? pool : THEME_IDS
  const shuffled = shuffle(base)
  const out = []
  for (let i = 0; i < n; i++) out.push(shuffled[i % shuffled.length])
  return out
}

// 표지 + 중간(mid) + 마무리(cta). offset으로 후보마다 순서 살짝 변주.
function buildSequence(recipe, count, offset) {
  const seq = ['cover']
  const midCount = Math.max(1, count - 2) // 마지막 1장은 cta로 예약
  for (let i = 0; i < midCount; i++) seq.push(recipe.mid[(i + offset) % recipe.mid.length])
  seq.push('cta')
  return seq
}

// 브리프 → 후보 덱 n개 (결정론적 조합, AI 없음)
export function generateDecks(brief, n = 4) {
  const { title = '', count = 5, recipeId = 'info', mood = 'auto' } = brief || {}
  const recipe = RECIPES[recipeId] || RECIPES.info
  const themes = pickThemes(MOOD_THEMES[mood], n)
  const variants = shuffle([0, 1, 2]) // 후보마다 다른 레이아웃 변형 (덱 안은 일관)

  return themes.map((themeId, idx) => {
    const variant = variants[idx % variants.length]
    const seq = buildSequence(recipe, count, idx)
    const cards = seq.map((tid) => {
      const c = makeCard(tid, variant)
      if (tid === 'cover' && title.trim()) c.slots.title = title.trim()
      return c
    })
    return {
      id: `cand_${Date.now()}_${idx}`,
      themeId,
      cards,
      recipeLabel: recipe.label,
    }
  })
}

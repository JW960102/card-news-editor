// 구성 레시피 = 카드 템플릿의 순서 패턴. 표지 뒤에 mid 패턴을 카드 수만큼 채움.
export const RECIPES = {
  info:  { label: '정보 전달형', mid: ['grid', 'stat', 'checklist'] },
  story: { label: '스토리형',    mid: ['body', 'quote', 'punch'] },
  tips:  { label: '요약·팁형',   mid: ['checklist', 'grid', 'stat'] },
}
export const RECIPE_IDS = Object.keys(RECIPES)

// 무드(테마 카테고리) → 사용할 테마 후보. null = 전체(자동, 가장 다양)
export const MOOD_THEMES = {
  auto: null,
  editorial: ['editorial', 'oat'],
  soft: ['cream', 'blush', 'lavender'],
  business: ['sky', 'editorial'],
  natural: ['sage'],
  bold: ['mono'],
}
export const MOODS = [
  { id: 'auto', label: '자동 (다양하게)' },
  { id: 'editorial', label: '미니멀 에디토리얼' },
  { id: 'soft', label: '감성 에세이' },
  { id: 'business', label: '비즈니스 리포트' },
  { id: 'natural', label: '프레시 내추럴' },
  { id: 'bold', label: '볼드 트렌디' },
]

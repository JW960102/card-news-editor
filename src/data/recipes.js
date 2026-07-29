// 6개 스타일 카테고리 = 레시피(구성) + 테마 풀 + 톤을 한 묶음으로 (리서치 스펙 C장 기반).
// 하나만 고르면 구성·색·톤이 다 정해짐. 'auto'는 후보마다 다른 카테고리로 생성.
export const CATEGORIES = {
  editorial: { label: '미니멀 에디토리얼', themes: ['editorial', 'oat'],            mid: ['body', 'quote', 'body'],       tone: '담백·선언형' },
  essay:     { label: '감성 에세이',       themes: ['cream', 'blush', 'lavender'],  mid: ['body', 'quote', 'punch'],      tone: '서정·1인칭·여운' },
  business:  { label: '비즈니스 리포트',   themes: ['sky', 'editorial'],            mid: ['grid', 'stat', 'checklist'],   tone: '명확·데이터' },
  natural:   { label: '프레시 내추럴',     themes: ['sage'],                        mid: ['checklist', 'grid', 'stat'],   tone: '친근·실용·따뜻' },
  bold:      { label: '볼드 트렌디',       themes: ['mono'],                        mid: ['punch', 'stat', 'punch'],      tone: '짧고 강한 훅' },
  promo:     { label: '브랜드 프로모션',   themes: ['blush', 'cream', 'sky'],       mid: ['grid', 'stat', 'checklist'],   tone: '행동유도·혜택' },
}
export const CATEGORY_IDS = Object.keys(CATEGORIES)

// 설정 화면의 "스타일" 선택지 (자동 + 6개)
export const STYLE_OPTIONS = [
  { id: 'auto', label: '자동 (다양하게)' },
  ...CATEGORY_IDS.map((id) => ({ id, label: CATEGORIES[id].label })),
]

// 디자인 팩 = { 토큰 + 그 팩만의 템플릿 }. 실측 기반 절대배치 템플릿을 씀.
// 새 디자인 추가 시 여기에 토큰 + packs/<pack>.jsx 템플릿만 넣으면 됨.
export const PACKS = {
  mint: {
    label: '민트',
    aspect: '4:5',
    base: 662, // 피그마 원본 폭 (cqw = px ÷ 6.62)
    tokens: {
      '--card-bg': '#b6dccd',
      '--card-surface': '#fcfcfa',
      '--card-ink': '#111111',
      '--card-sub': '#3d3d3d',
      '--card-accent': '#72b9bd',
      '--card-neutral': '#ededed',
      '--font-display': "'Pretendard Variable', Pretendard, sans-serif",
      '--font-body': "'Pretendard Variable', Pretendard, sans-serif",
    },
    templates: ['cover', 'body', 'item', 'closing'],
    defaults: {
      cover: { date: '5월 21일', title: '부부의 날', caption: '둘이 하나가 된 우리, 다시 한번 서로를 돌아보는 날' },
      body: { label: 'WHY', heading: '왜 하필 5월 21일일까요?', body: '2와 1이 만나 ‘둘이 하나가 된다’는 의미를 담고 있어요. 서로의 관계를 돌아보고 사랑을 확인하는 날입니다.', note: '1995년 권재도 목사 부부에 의해 시작되어 2007년 국가 기념일로 승격되었습니다' },
      item: { heading: '부부의 날 선물 LIST', label: 'BEST3', name: '꽃다발 선물', caption: '함께라서 더 빛나는 우리에게, 작은 꽃으로 마음을 전해요' },
      closing: { message: '함께한 시간만큼 쌓인 마음들, 오늘은 그 마음을 꺼내어 전해보세요', title: '5월 21일 부부의 날', quote: '“고마워, 그리고 사랑해”' },
    },
  },
}
export const PACK_IDS = Object.keys(PACKS)

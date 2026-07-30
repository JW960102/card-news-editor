// 디자인 팩 = { 토큰 + 역할 바구니(blocks) + 조합 규칙(roleplan) }.
//
// ┌ 뼈대 원칙 ─────────────────────────────────────────────────────────┐
// │ · 각 블록은 role(역할)을 가짐. 같은 role 블록이 여러 개면 = 그 역할  │
// │   바구니가 커지고, 조합 엔진이 자동으로 골라 다양성이 곱셈으로 늚.  │
// │ · 디자인 추가 = ① packs/<pack>.jsx 에 렌더 case 1개                 │
// │                 ② 아래 blocks 에 `body2: { role:'body', ... }` 한 줄  │
// │   → 엔진(packEngine.js)은 두 번 다시 안 건드림.                      │
// └────────────────────────────────────────────────────────────────────┘
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
    // 역할 바구니: blockId → { role, defaults }
    blocks: {
      cover:   { role: 'cover',   defaults: { date: '5월 21일', title: '부부의 날', caption: '둘이 하나가 된 우리, 다시 한번 서로를 돌아보는 날' } },
      body:    { role: 'body',    defaults: { label: 'WHY', heading: '왜 하필 5월 21일일까요?', body: '2와 1이 만나 ‘둘이 하나가 된다’는 의미를 담고 있어요. 서로의 관계를 돌아보고 사랑을 확인하는 날입니다.', note: '1995년 권재도 목사 부부에 의해 시작되어 2007년 국가 기념일로 승격되었습니다' } },
      item:    { role: 'item',    defaults: { heading: '부부의 날 선물 LIST', label: 'BEST3', name: '꽃다발 선물', caption: '함께라서 더 빛나는 우리에게, 작은 꽃으로 마음을 전해요' } },
      closing: { role: 'closing', defaults: { message: '함께한 시간만큼 쌓인 마음들, 오늘은 그 마음을 꺼내어 전해보세요', title: '5월 21일 부부의 날', quote: '“고마워, 그리고 사랑해”' } },
    },
    // 조합 규칙: 맨 앞 opener, 맨 뒤 closer(선택), 나머지 role 은 자동으로 mid.
    roleplan: { opener: 'cover', closer: 'closing' },
  },

  sky: {
    label: '스카이',
    aspect: '1:1',
    base: 824, // cqw = px ÷ 8.24
    tokens: {
      '--card-bg': '#3bcff7',
      '--card-surface': '#ffffff',
      '--card-ink': '#4b4b4b',
      '--card-sub': '#767676',
      '--card-accent': '#ff86c3',
      '--card-neutral': '#e7e7e7',
      '--font-display': "'Pretendard Variable', Pretendard, sans-serif",
      '--font-body': "'Pretendard Variable', Pretendard, sans-serif",
    },
    blocks: {
      cover:  { role: 'cover',  defaults: { badge: '알뜰살뜰', title: '여기에서 받으세요' } },
      list:   { role: 'list',   defaults: {
        line1: '이곳 저곳 마구잡이로 흩어진 대출', line2: '관리하기 힘드신가요?',
        items: [
          { main: '카드론, 현금서비스', sub: '네 건 이상 사용 중' },
          { main: '여러 금융사 대출 중', sub: '네 건 이상 사용 중' },
          { main: '비상 자금이 필요함', sub: '네 건 이상 사용 중' },
          { main: '추가 자금 마련 필요', sub: '네 건 이상 사용 중' },
        ],
        foot: '* 설문조사 기준으로 작성되었습니다.',
      } },
      vs:     { role: 'vs',     defaults: {
        line1: '월 납입금액을 절반으로 줄여주는', line2: '망고은행을 살펴보세요',
        beforeItems: ['카드사', '서비스', '대출'], afterName: '망고저축은행', afterHighlight: '( 연3.7%~ )',
        beforeNote: '월 200만원 이상의 이자', afterNote: '월 120만원 이자 절감 효과',
      } },
      qna:    { role: 'qna',    defaults: {
        line1: '대출 받기 전 궁금하신 점이 있다면', line2: '무엇이든 물어보세요', tab: '자주 물어보시는 질문',
        items: [
          { q: '신용점수가 낮아도 대출 이용이 가능한가요?', a: '다양한 조건을 고려해 유연하게 심사를 진행 중입니다' },
          { q: '현재 직장이 없어도 대출 신청할 수 있나요?', a: '소득 형태에 따라 프리랜서·사업자도 신청 가능합니다' },
          { q: '대출 진행까지 시간이 얼마나 소요되나요?', a: '빠른 심사가 이루어지며 바로 이용 가능합니다' },
        ],
        foot: '* 실제 상담 내용을 바탕으로 작성되었습니다.',
      } },
      triple: { role: 'triple', defaults: {
        line1: '내가 받을 수 있을지 궁금하신가요', line2: '아래를 확인해보세요',
        cols: [
          { title: '직장인', cap: '회사 재직하신 지 3개월 이상이신 분' },
          { title: '사업자', cap: '사업 운영하신 지 8개월 이상인 분' },
          { title: '프리랜서', cap: '소득 증빙 가능한 자유직 근로자' },
        ],
      } },
      info:   { role: 'info',   defaults: {
        line1: '언제나 열려있는 망고 대출상담소', line2: '운영 시간을 확인해요', tab: '운영 시간 및 연락처',
        leftHead: '[ 운영시간 ]', rightHead: '[ 문의번호 ]',
        leftLines: ['평일 : 오전 9:00 - 오후 6:00', '주말 : 오전 9:00 - 오후 2:00'],
        rightLines: ['123) 4567-8912 (1234)', '123) 4567-8912 (1234)'],
      } },
    },
    roleplan: { opener: 'cover' }, // closer 없음
  },
}
export const PACK_IDS = Object.keys(PACKS)

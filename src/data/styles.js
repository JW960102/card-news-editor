// 스타일 프리셋 = 색·폰트 토큰 묶음. 레이아웃(위치)과 분리된 "룩" 레이어.
// 사용자가 [판매/통계/뉴스]를 고르면 이 토큰이 카드에 씌워진다. 위치는 아키타입이 계산.
export const STYLES = {
  sales: {
    label: '판매',
    tokens: {
      '--card-bg': '#ffe9e0', '--card-surface': '#ffffff',
      '--card-ink': '#1a1a1a', '--card-sub': '#8a5a4c',
      '--card-accent': '#ff5a3c', '--card-neutral': '#f0e6e2',
      '--font-display': "'Pretendard Variable', Pretendard, sans-serif",
      '--font-body': "'Pretendard Variable', Pretendard, sans-serif",
    },
  },
  stats: {
    label: '통계',
    tokens: {
      '--card-bg': '#eaf1fb', '--card-surface': '#ffffff',
      '--card-ink': '#16233a', '--card-sub': '#5a6b85',
      '--card-accent': '#2f6df6', '--card-neutral': '#e2e9f3',
      '--font-display': "'Pretendard Variable', Pretendard, sans-serif",
      '--font-body': "'Pretendard Variable', Pretendard, sans-serif",
    },
  },
  news: {
    label: '뉴스',
    tokens: {
      '--card-bg': '#f3f1ec', '--card-surface': '#ffffff',
      '--card-ink': '#141414', '--card-sub': '#5a5a5a',
      '--card-accent': '#c0392b', '--card-neutral': '#e7e4dd',
      '--font-display': "'Pretendard Variable', Pretendard, sans-serif",
      '--font-body': "'Pretendard Variable', Pretendard, sans-serif",
    },
  },
}
export const STYLE_IDS = Object.keys(STYLES)

// 디자인 캔버스(설계 좌표 px). 요소 x/y/w/h 는 이 공간의 px.
// 렌더 시 cqw(카드폭 1%)로 환산 → 표시 크기에 자동 스케일. (cqw = px / (w/100))
export const CANVAS = { w: 1080, h: 1350, aspect: '4:5' }

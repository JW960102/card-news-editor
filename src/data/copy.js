// 카테고리별 예시 카피(placeholder). 생성 시 카드에 주입 → 시안이 톤·글자부터 달라 보임.
// 사용자가 나중에 덮어쓰면 됨. 각 카테고리는 자기 레시피가 쓰는 템플릿만 채움(없으면 템플릿 기본값).
export const CATEGORY_COPY = {
  editorial: {
    cover: { title: '좋은 디자인은 조용하다', subtitle: 'A NOTE ON CRAFT' },
    body: { heading: '덜어내는 일', body: '필요 없는 것을 없애는 것만으로 메시지는 또렷해진다.' },
    quote: { quote: '단순함은 궁극의 정교함이다', source: '— 레오나르도 다 빈치' },
    cta: { heading: '더 보기', sub: '작업의 전체 과정은 프로필에서', button: '포트폴리오' },
  },
  essay: {
    cover: { title: '그날, 나는 조금 울었다', subtitle: '어느 밤의 기록' },
    body: { heading: '문득', body: '아무 일도 아닌 하루가, 왜 이렇게 오래 남는 걸까.' },
    quote: { quote: '기억은 지나간 것이 아니라 지금도 자란다', source: '— 어느 일기' },
    punch: { text: '그래도, 괜찮았다' },
    cta: { heading: '다음 이야기', sub: '이어지는 글은 프로필에서', button: '더 읽기' },
  },
  business: {
    cover: { title: '한눈에 보는 2026 상반기', subtitle: 'HALF-YEAR REPORT' },
    grid: { heading: '핵심 지표 4가지', items: ['매출 성장', '신규 고객', '재구매율', '이탈률'] },
    stat: { number: '32', unit: '%', caption: '전년 대비 매출 성장' },
    checklist: { heading: '하반기 실행안', items: ['목표 재설정', '지표 대시보드 구축', '주간 리뷰 도입'] },
    cta: { heading: '전체 리포트 보기', sub: '자세한 데이터는 링크에서', button: '다운로드' },
  },
  natural: {
    cover: { title: '오늘도 천천히', subtitle: '건강한 하루 습관' },
    checklist: { heading: '아침 루틴 체크', items: ['물 한 잔', '5분 스트레칭', '창문 열기'] },
    grid: { heading: '이번 주 목표 4', items: ['일찍 자기', '계단 이용', '집밥 먹기', '산책하기'] },
    stat: { number: '8', unit: '잔', caption: '하루 권장 수분 섭취' },
    cta: { heading: '함께 시작해요', sub: '더 많은 팁은 프로필에서', button: '팔로우' },
  },
  bold: {
    cover: { title: '지금 안 하면 언제 해?', subtitle: 'JUST START' },
    punch: { text: '변명은 그만' },
    stat: { number: '100', unit: '%', caption: '오늘부터 진심' },
    cta: { heading: '시작은 지금', sub: '자세한 건 링크에서', button: '바로가기' },
  },
  promo: {
    cover: { title: '단 3일, 특별 혜택', subtitle: 'LIMITED OFFER' },
    grid: { heading: '이런 분께 추천', items: ['첫 구매', '재입고 대기', '선물 고민', '가성비 중시'] },
    stat: { number: '50', unit: '%', caption: '역대 최대 할인' },
    checklist: { heading: '혜택 한눈에', items: ['전 상품 반값', '무료 배송', '사은품 증정'] },
    cta: { heading: '지금 구매하기', sub: '이벤트는 곧 종료됩니다', button: '구매하러 가기' },
  },
}

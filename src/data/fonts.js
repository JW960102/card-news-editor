// 폰트 세트 = 글꼴 토큰 묶음. 색(STYLES)과는 별개의 축이다.
// 카드뉴스에서 톤을 가장 크게 가르는 게 글꼴인데 지금까지 Pretendard 하나뿐이었다.
//
// display = 제목·숫자 / body = 본문·캡션.
// 한글 글리프가 있는 것만 고른다 (General Sans·Newsreader 는 영문 전용이라 제외).
// 실제 웹폰트 로드는 index.html 의 <link> 가 담당한다 — 여기 추가하면 거기도 같이 추가할 것.
const PRETENDARD = "'Pretendard Variable', Pretendard, sans-serif"

export const FONTS = {
  default: {
    label: '기본',
    sample: '가나',
    tokens: { '--font-display': PRETENDARD, '--font-body': PRETENDARD },
  },
  serif: {
    label: '명조',
    sample: '가나',
    tokens: {
      '--font-display': "'Nanum Myeongjo', serif",
      '--font-body': "'Nanum Myeongjo', serif",
    },
  },
  impact: {
    label: '임팩트',
    sample: '가나',
    // 제목만 굵게 눌러 주고 본문은 읽히도록 남겨 둔다 (Black Han Sans 는 굵기가 하나뿐)
    tokens: {
      '--font-display': "'Black Han Sans', sans-serif",
      '--font-body': PRETENDARD,
    },
  },
  round: {
    label: '둥근',
    sample: '가나',
    tokens: {
      '--font-display': "'Jua', sans-serif",
      '--font-body': PRETENDARD,
    },
  },
}

export const FONT_IDS = Object.keys(FONTS)
export const DEFAULT_FONT = 'default'

// 개별 텍스트 요소용 글꼴 목록 (세트가 아니라 '한 서체').
// 우측 인스펙터에서 이 텍스트만 다른 글꼴로 바꿀 때 쓴다.
// 아무것도 고르지 않으면(face 없음) 덱의 폰트 세트를 따른다.
export const FACES = {
  sans: { label: '기본', family: PRETENDARD },
  myeongjo: { label: '명조', family: "'Nanum Myeongjo', serif" },
  impact: { label: '임팩트', family: "'Black Han Sans', sans-serif" },
  round: { label: '둥근', family: "'Jua', sans-serif" },
}
export const FACE_IDS = Object.keys(FACES)

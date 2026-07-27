// 템플릿 5종 = 슬롯 배열 프리셋. 자유 배치 없음(제약=기능).
// slots: 각 카드가 채우는 콘텐츠 필드. defaults = 새 카드 생성 시 초기값.
export const TEMPLATES = {
  cover: {
    label: '표지',
    defaults: { title: '제목을 입력하세요', subtitle: '부제목' },
  },
  body: {
    label: '본문',
    defaults: { heading: '소제목', body: '본문 내용을 입력하세요. 한 카드에 한 가지 메시지만 담는 게 좋아요.' },
  },
  list: {
    label: '리스트',
    defaults: { heading: '목록 제목', items: ['첫 번째 항목', '두 번째 항목', '세 번째 항목'] },
  },
  quote: {
    label: '인용',
    defaults: { quote: '여기에 인용하고 싶은 문장을 적으세요', source: '— 출처' },
  },
  stat: {
    label: '통계',
    defaults: { number: '89', unit: '%', caption: '설명을 입력하세요' },
  },
}

export const TEMPLATE_IDS = Object.keys(TEMPLATES)

// 새 카드 객체 생성
let seq = 0
export function makeCard(templateId = 'cover') {
  const t = TEMPLATES[templateId]
  return {
    id: `card_${Date.now()}_${seq++}`,
    templateId,
    slots: structuredClone(t.defaults),
  }
}

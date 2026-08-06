import { STYLES } from '../data/styles.js'
import { FONTS, DEFAULT_FONT } from '../data/fonts.js'

// 카드에 씌울 최종 토큰 = 스타일(색) + 폰트.
// 색과 글꼴을 따로 고를 수 있게 두 축을 여기서 합친다.
// 폰트 토큰이 뒤에 오므로 스타일이 들고 있던 --font-* 를 덮어쓴다.
//
// ⚠️ 카드를 그리는 모든 곳(작업창·썸네일·내보내기)이 이 함수를 써야 한다.
//    한 군데라도 STYLES[...].tokens 를 직접 쓰면 그 화면만 폰트가 안 바뀐다.
export function deckTokens(deck) {
  const style = STYLES[deck?.styleId] || STYLES.stats
  const font = FONTS[deck?.fontId] || FONTS[DEFAULT_FONT]
  return { ...style.tokens, ...font.tokens }
}

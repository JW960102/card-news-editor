import GenApp from './components/GenApp.jsx'
import PackApp from './components/PackApp.jsx'
import PackPreview from './components/PackPreview.jsx'
import CardNewsApp from './components/CardNewsApp.jsx'

export default function App() {
  const params = new URLSearchParams(window.location.search)
  if (params.has('legacy')) return <CardNewsApp />        // 구 flex 흐름 (보존)
  if (params.has('packs')) return <PackApp />              // 팩 재조합 실험 (보존)
  const pack = params.get('pack')
  if (pack) return <PackPreview packId={pack} />           // 특정 팩 직접
  return <GenApp />                                         // 메인: 생성 엔진
}

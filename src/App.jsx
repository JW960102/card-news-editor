import CardNewsApp from './components/CardNewsApp.jsx'
import PackPreview from './components/PackPreview.jsx'

export default function App() {
  const pack = new URLSearchParams(window.location.search).get('pack')
  if (pack) return <PackPreview packId={pack} />
  return <CardNewsApp />
}

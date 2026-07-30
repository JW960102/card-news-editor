import { useState } from 'react'
import GenSetup from './GenSetup.jsx'
import GenWorkspace from './GenWorkspace.jsx'
import { generateScaffold } from '../lib/generateScaffold.js'

// 메인 흐름: 설정 → 생성 → 편집/저장
export default function GenApp() {
  const [brief, setBrief] = useState(null)
  const [deck, setDeck] = useState(null)

  const generate = (b) => { setBrief(b); setDeck(generateScaffold(b)) }
  const open = (d) => { setBrief(null); setDeck(d) }

  if (!deck) return <GenSetup onGenerate={generate} onOpen={open} />
  return (
    <GenWorkspace
      key={deck.id}
      deck={deck}
      onBack={() => setDeck(null)}
      onRegenerate={() => setDeck(generateScaffold(brief))}
    />
  )
}

import { useState } from 'react'
import SetupScreen from './SetupScreen.jsx'
import PickScreen from './PickScreen.jsx'
import CardNewsMaker from './CardNewsMaker.jsx'
import { generateDecks } from '../lib/generateDecks.js'
import '../css/maker.css'

// 전체 플로우: ① 설정 → ② 시안 선택 → ③ 편집기
export default function CardNewsApp() {
  const [step, setStep] = useState('setup') // setup | pick | edit
  const [brief, setBrief] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [chosen, setChosen] = useState(null)
  const [editKey, setEditKey] = useState(0) // 새 시안 선택 시 편집기 리셋용

  const handleGenerate = (b) => {
    setBrief(b)
    setCandidates(generateDecks(b))
    setStep('pick')
  }
  const handleRegenerate = () => setCandidates(generateDecks(brief))
  const handlePick = (deck) => {
    setChosen({ cards: deck.cards, themeId: deck.themeId, category: deck.category })
    setEditKey((k) => k + 1)
    setStep('edit')
  }
  const handleRestart = () => setStep('setup')

  if (step === 'setup') return <SetupScreen onGenerate={handleGenerate} />
  if (step === 'pick')
    return (
      <PickScreen
        candidates={candidates}
        onPick={handlePick}
        onBack={() => setStep('setup')}
        onRegenerate={handleRegenerate}
      />
    )
  return <CardNewsMaker key={editKey} initialDeck={chosen} onRestart={handleRestart} />
}

import { useState } from 'react'
import StylePicker from './StylePicker.jsx'
import PackSetup from './PackSetup.jsx'
import PackPick from './PackPick.jsx'
import PackPreview from './PackPreview.jsx'
import { generatePackDecks } from '../lib/packEngine.js'

// 메인 팩 흐름: ① 스타일 → ② 설정 → ③ 시안(조합) 고르기 → ④ 편집/내보내기
export default function PackApp() {
  const [step, setStep] = useState('style')
  const [pid, setPid] = useState(null)
  const [brief, setBrief] = useState({ title: '', count: 5 })
  const [candidates, setCandidates] = useState([])
  const [deck, setDeck] = useState(null)

  const generate = (b) => {
    setBrief(b)
    setCandidates(generatePackDecks(pid, b, 4))
    setStep('pick')
  }

  if (step === 'style')
    return <StylePicker onPick={(id) => { setPid(id); setStep('setup') }} />

  if (step === 'setup')
    return <PackSetup packId={pid} onBack={() => setStep('style')} onGenerate={generate} />

  if (step === 'pick')
    return (
      <PackPick
        packId={pid}
        candidates={candidates}
        onBack={() => setStep('setup')}
        onRegenerate={() => setCandidates(generatePackDecks(pid, brief, 4))}
        onPick={(d) => { setDeck(d); setStep('edit') }}
      />
    )

  return <PackPreview packId={pid} deck={deck} onBack={() => setStep('pick')} />
}

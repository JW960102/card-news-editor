import { useState } from 'react'
import GenSetup from './GenSetup.jsx'
import GenWorkspace from './GenWorkspace.jsx'
import { generateScaffold } from '../lib/generateScaffold.js'

// 메인 흐름 — 한 화면 안에서 [설정 패널 | 작업 영역].
// 전에는 설정과 작업창이 별도 화면이라 오가야 했고, 작업창 좌우가 텅 비었다.
// 이제 설정이 좌측 패널로 들어가고, 초안을 만들면 스스로 접혀 캔버스에 자리를 내준다.
export default function GenApp() {
  const [brief, setBrief] = useState(null)
  const [deck, setDeck] = useState(null)
  const [panelOpen, setPanelOpen] = useState(true)

  const generate = (b) => {
    setBrief(b)
    setDeck(generateScaffold(b))
    setPanelOpen(false)      // 만들고 나면 캔버스를 넓게 쓴다
  }
  const open = (d) => { setBrief(null); setDeck(d); setPanelOpen(false) }
  // 덱의 겉값(폰트 등)만 바꾼다. id 가 그대로라 key 가 유지되어 작업 히스토리가 살아남는다.
  const patch = (p) => setDeck((d) => (d ? { ...d, ...p } : d))

  return (
    <div style={{ height: '100%', display: 'flex', overflow: 'hidden' }}>
      <GenSetup
        open={panelOpen}
        onToggle={() => setPanelOpen((v) => !v)}
        onGenerate={generate}
        onOpen={open}
        deckFontId={deck?.fontId}
        onDeckFontChange={(id) => patch({ fontId: id })}
      />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {deck ? (
          <GenWorkspace
            key={deck.id}
            deck={deck}
            onBack={() => setPanelOpen(true)}
            onRegenerate={() => brief && setDeck(generateScaffold(brief))}
            onPatch={patch}
          />
        ) : (
          <Empty onOpenPanel={() => setPanelOpen(true)} panelOpen={panelOpen} />
        )}
      </div>
    </div>
  )
}

// 아직 만든 게 없을 때 — 빈 회색 화면만 두면 고장난 줄 안다
function Empty({ onOpenPanel, panelOpen }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, background: '#ececed', fontFamily: 'sans-serif', color: '#777' }}>
      <div style={{ width: 132, height: 165, borderRadius: 8, border: '2px dashed #c9c9cb' }} />
      <p style={{ fontSize: 14 }}>왼쪽에서 설정하고 초안을 만들어 보세요.</p>
      {!panelOpen && (
        <button onClick={onOpenPanel}
          style={{ height: 38, padding: '0 18px', borderRadius: 10, border: 'none', background: '#111', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
          설정 열기
        </button>
      )}
    </div>
  )
}

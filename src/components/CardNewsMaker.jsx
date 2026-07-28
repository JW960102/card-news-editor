import { useState, useRef } from 'react'
import CardCanvas from './CardCanvas.jsx'
import DeckStrip from './DeckStrip.jsx'
import { TEMPLATES, TEMPLATE_IDS, makeCard } from '../data/templates.js'
import { THEMES, THEME_IDS } from '../data/themes.js'
import { captureCard, downloadDataURL } from '../lib/exportCard.js'
import '../css/maker.css'

export default function CardNewsMaker() {
  const [cards, setCards] = useState(() => [makeCard('cover'), makeCard('body')])
  const [current, setCurrent] = useState(0)
  const [themeId, setThemeId] = useState('editorial')
  const [exporting, setExporting] = useState(false)
  const cardRef = useRef(null)

  const card = cards[current]
  const theme = THEMES[themeId]

  // ── 슬롯 편집 ──
  const setSlot = (key, value) => {
    setCards((prev) => prev.map((c, i) =>
      i === current ? { ...c, slots: { ...c.slots, [key]: value } } : c
    ))
  }

  // ── 카드 CRUD ──
  const addCard = () => {
    setCards((prev) => {
      const next = [...prev, makeCard('body')]
      setCurrent(next.length - 1)
      return next
    })
  }
  const deleteCard = (i) => {
    setCards((prev) => {
      if (prev.length === 1) return prev
      const next = prev.filter((_, j) => j !== i)
      setCurrent((c) => Math.max(0, Math.min(c, next.length - 1)))
      return next
    })
  }
  const moveCard = (i, dir) => {
    setCards((prev) => {
      const j = i + dir
      if (j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
    setCurrent((c) => (c === i ? i + dir : c === i + dir ? i : c))
  }

  // ── 템플릿 변경 (기존 내용 최대한 유지) ──
  const changeTemplate = (tid) => {
    const defaults = TEMPLATES[tid].defaults
    const merged = {}
    for (const k in defaults) {
      merged[k] = k in card.slots ? card.slots[k] : structuredClone(defaults[k])
    }
    setCards((prev) => prev.map((c, i) => (i === current ? { ...c, templateId: tid, slots: merged } : c)))
  }

  // ── 내보내기 (현재 카드) ──
  const exportCurrent = async () => {
    if (!cardRef.current) return
    setExporting(true)
    try {
      const dataURL = await captureCard(cardRef.current, { background: theme.vars['--card-bg'] })
      downloadDataURL(dataURL, `card-${current + 1}.png`)
    } catch (e) {
      console.error('내보내기 실패', e)
      alert('내보내기에 실패했어요. 콘솔을 확인해주세요.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="maker">
      {/* 상단 툴바 */}
      <header className="maker-topbar">
        <span className="maker-logo">Card News Editor</span>
        <button className="maker-export" onClick={exportCurrent} disabled={exporting}>
          {exporting ? '내보내는 중…' : '이 카드 PNG 저장'}
        </button>
      </header>

      <div className="maker-body">
        {/* 좌측 컨트롤 */}
        <aside className="maker-panel">
          <section className="panel-group">
            <h3 className="panel-title">템플릿</h3>
            <div className="panel-btns">
              {TEMPLATE_IDS.map((tid) => (
                <button
                  key={tid}
                  className={'chip' + (card.templateId === tid ? ' active' : '')}
                  onClick={() => changeTemplate(tid)}
                >{TEMPLATES[tid].label}</button>
              ))}
            </div>
          </section>

          <section className="panel-group">
            <h3 className="panel-title">테마</h3>
            <div className="swatches">
              {THEME_IDS.map((id) => {
                const v = THEMES[id].vars
                return (
                  <button
                    key={id}
                    className={'swatch' + (themeId === id ? ' active' : '')}
                    onClick={() => setThemeId(id)}
                    title={THEMES[id].label}
                  >
                    <span className="swatch-chip" style={{ background: v['--card-bg'] }}>
                      <span className="swatch-dot" style={{ background: v['--card-accent'] }} />
                    </span>
                    <span className="swatch-label">{THEMES[id].label}</span>
                  </button>
                )
              })}
            </div>
          </section>
        </aside>

        {/* 중앙 캔버스 */}
        <main className="maker-stage">
          <CardCanvas card={card} theme={theme} onSlot={setSlot} cardRef={cardRef} />
        </main>
      </div>

      {/* 하단 덱 */}
      <DeckStrip
        cards={cards}
        currentIndex={current}
        theme={theme}
        onSelect={setCurrent}
        onAdd={addCard}
        onDelete={deleteCard}
        onMove={moveCard}
      />
    </div>
  )
}

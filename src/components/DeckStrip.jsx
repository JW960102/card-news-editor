import { useState } from 'react'
import TemplateRenderer from './TemplateRenderer.jsx'
import { TEMPLATES } from '../data/templates.js'

// 하단 레이어(카드) 관리: 드래그로 순서변경 + 좌상단 X 삭제 + 썸네일 미리보기.
export default function DeckStrip({ cards, currentIndex, theme, category, onSelect, onAdd, onDelete, onReorder }) {
  const [dragIndex, setDragIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)

  const handleDrop = (to) => {
    onReorder(dragIndex, to)
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <div className="deck-strip">
      {cards.map((card, i) => (
        <div
          key={card.id}
          className={
            'deck-item' +
            (i === currentIndex ? ' active' : '') +
            (i === overIndex && dragIndex !== null && dragIndex !== i ? ' drop-target' : '') +
            (i === dragIndex ? ' dragging' : '')
          }
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragOver={(e) => { e.preventDefault(); setOverIndex(i) }}
          onDrop={() => handleDrop(i)}
          onDragEnd={() => { setDragIndex(null); setOverIndex(null) }}
          onClick={() => onSelect(i)}
        >
          <button
            className="deck-del"
            onClick={(e) => { e.stopPropagation(); onDelete(i) }}
            disabled={cards.length === 1}
            aria-label="레이어 삭제"
          >×</button>
          <div className="deck-thumb">
            <div
              className={'deck-thumb-inner' + (category ? ' cat-' + category : '')}
              style={{ ...theme.vars, background: 'var(--card-bg)', color: 'var(--card-ink)' }}
            >
              <TemplateRenderer card={card} editable={false} />
            </div>
          </div>
          <span className="deck-idx">{i + 1}. {TEMPLATES[card.templateId].label}</span>
        </div>
      ))}
      <button className="deck-add" onClick={onAdd}>+ 카드</button>
    </div>
  )
}

import TemplateRenderer from './TemplateRenderer.jsx'
import { TEMPLATES } from '../data/templates.js'

// 하단 카드 덱: 썸네일 선택 + 추가/삭제 + 순서이동(Tier-1 조작).
export default function DeckStrip({ cards, currentIndex, theme, onSelect, onAdd, onDelete, onMove }) {
  return (
    <div className="deck-strip">
      {cards.map((card, i) => (
        <div
          key={card.id}
          className={'deck-item' + (i === currentIndex ? ' active' : '')}
          onClick={() => onSelect(i)}
        >
          <div className="deck-thumb">
            <div className="deck-thumb-inner" style={{ ...theme.vars, background: 'var(--card-bg)', color: 'var(--card-ink)' }}>
              <TemplateRenderer card={card} editable={false} />
            </div>
          </div>
          <div className="deck-item-bar">
            <span className="deck-item-idx">{i + 1}. {TEMPLATES[card.templateId].label}</span>
            <span className="deck-item-actions">
              <button onClick={(e) => { e.stopPropagation(); onMove(i, -1) }} disabled={i === 0} aria-label="앞으로">‹</button>
              <button onClick={(e) => { e.stopPropagation(); onMove(i, 1) }} disabled={i === cards.length - 1} aria-label="뒤로">›</button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(i) }} disabled={cards.length === 1} aria-label="삭제">×</button>
            </span>
          </div>
        </div>
      ))}
      <button className="deck-add" onClick={onAdd}>+ 카드</button>
    </div>
  )
}

import TemplateRenderer from './TemplateRenderer.jsx'

// 4:5 고정 카드. 테마 CSS 변수를 루트에 주입 → 하위 템플릿이 상속.
// cardRef = 내보내기(html2canvas) 대상 DOM.
export default function CardCanvas({ card, theme, onSlot, cardRef }) {
  const style = {
    ...theme.vars,
    background: 'var(--card-bg)',
    color: 'var(--card-ink)',
  }
  return (
    <div className="card-canvas" ref={cardRef} style={style}>
      <TemplateRenderer card={card} editable onSlot={onSlot} />
    </div>
  )
}

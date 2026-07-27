import EditableText from './EditableText.jsx'

// 템플릿별 렌더. editable=true면 슬롯 편집 가능(캔버스), false면 정적(썸네일).
// 모든 색/폰트는 테마 CSS 변수(--card-*)를 상속받아 사용 → 일관성 자동.
export default function TemplateRenderer({ card, editable = false, onSlot }) {
  const s = card.slots
  const set = (key) => (val) => onSlot && onSlot(key, val)

  switch (card.templateId) {
    case 'cover':
      return (
        <div className="tpl tpl-cover">
          <EditableText className="tpl-title" value={s.title} onChange={set('title')} />
          <EditableText className="tpl-subtitle" value={s.subtitle} onChange={set('subtitle')} />
        </div>
      )

    case 'body':
      return (
        <div className="tpl tpl-body">
          <EditableText className="tpl-heading" value={s.heading} onChange={set('heading')} />
          <EditableText className="tpl-paragraph" value={s.body} onChange={set('body')} />
        </div>
      )

    case 'list':
      return (
        <div className="tpl tpl-list">
          <EditableText className="tpl-heading" value={s.heading} onChange={set('heading')} />
          <ol className="tpl-items">
            {s.items.map((item, i) => (
              <li key={i} className="tpl-item">
                <span className="tpl-item-num" style={{ color: 'var(--card-accent)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <EditableText
                  className="tpl-item-text"
                  value={item}
                  onChange={(val) => {
                    const next = [...s.items]
                    next[i] = val
                    onSlot && onSlot('items', next)
                  }}
                />
                {editable && s.items.length > 1 && (
                  <button
                    className="tpl-item-del"
                    onClick={() => onSlot && onSlot('items', s.items.filter((_, j) => j !== i))}
                    aria-label="항목 삭제"
                  >×</button>
                )}
              </li>
            ))}
          </ol>
          {editable && s.items.length < 6 && (
            <button
              className="tpl-item-add"
              onClick={() => onSlot && onSlot('items', [...s.items, '새 항목'])}
            >+ 항목 추가</button>
          )}
        </div>
      )

    case 'quote':
      return (
        <div className="tpl tpl-quote">
          <span className="tpl-quote-mark" style={{ color: 'var(--card-accent)' }}>“</span>
          <EditableText className="tpl-quote-text" value={s.quote} onChange={set('quote')} />
          <EditableText className="tpl-quote-source" value={s.source} onChange={set('source')} />
        </div>
      )

    case 'stat':
      return (
        <div className="tpl tpl-stat">
          <div className="tpl-stat-figure">
            <EditableText className="tpl-stat-number" value={s.number} onChange={set('number')} tag="span" />
            <EditableText className="tpl-stat-unit" value={s.unit} onChange={set('unit')} tag="span" />
          </div>
          <EditableText className="tpl-stat-caption" value={s.caption} onChange={set('caption')} />
        </div>
      )

    default:
      return <div className="tpl">알 수 없는 템플릿</div>
  }
}

import TemplateRenderer from './TemplateRenderer.jsx'
import { THEMES } from '../data/themes.js'

// ② 선택 화면 — 자동 생성된 시안 덱들 중 하나 선택 (나머지는 유지 → 다시 생성/뒤로 가능)
export default function PickScreen({ candidates, onPick, onBack, onRegenerate }) {
  return (
    <div className="pick">
      <header className="pick-top">
        <button className="icon-btn" onClick={onBack} title="설정으로">←</button>
        <span className="pick-title">마음에 드는 시안을 고르세요</span>
        <button className="pick-regen" onClick={onRegenerate}>🎲 다시 생성</button>
      </header>

      <div className="pick-grid">
        {candidates.map((c) => (
          <button key={c.id} className="pick-card" onClick={() => onPick(c)}>
            <div className="pick-preview">
              {c.cards.slice(0, 6).map((card) => (
                <div
                  key={card.id}
                  className="pick-thumb"
                  style={{ ...THEMES[c.themeId].vars, background: 'var(--card-bg)', color: 'var(--card-ink)' }}
                >
                  <div className="pick-thumb-inner">
                    <TemplateRenderer card={card} editable={false} />
                  </div>
                </div>
              ))}
            </div>
            <div className="pick-meta">
              <b>{THEMES[c.themeId].label}</b> · {c.recipeLabel} · {c.cards.length}장
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

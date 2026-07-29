import { useState } from 'react'
import { STYLE_OPTIONS } from '../data/recipes.js'

// ① 설정(브리프) 화면 — 몇 가지만 정하면 시안 자동 생성
export default function SetupScreen({ onGenerate }) {
  const [title, setTitle] = useState('')
  const [count, setCount] = useState(5)
  const [style, setStyle] = useState('auto')

  return (
    <div className="setup">
      <div className="setup-card">
        <h1 className="setup-title">카드뉴스 만들기</h1>
        <p className="setup-sub">몇 가지만 정하면 시안 4개를 자동으로 만들어드려요. 글은 나중에 채우면 돼요.</p>

        <label className="setup-field">
          <span className="setup-label">주제 / 제목</span>
          <input
            className="setup-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 프론트 없이, 3시간 만에 만든 앱"
          />
        </label>

        <label className="setup-field">
          <span className="setup-label">카드 수</span>
          <div className="seg-row">
            {[3, 4, 5, 6, 7].map((n) => (
              <button key={n} className={'seg' + (count === n ? ' active' : '')} onClick={() => setCount(n)}>{n}</button>
            ))}
          </div>
        </label>

        <label className="setup-field">
          <span className="setup-label">스타일</span>
          <div className="chip-row">
            {STYLE_OPTIONS.map((o) => (
              <button key={o.id} className={'chip' + (style === o.id ? ' active' : '')} onClick={() => setStyle(o.id)}>
                {o.label}
              </button>
            ))}
          </div>
        </label>

        <button className="setup-go" onClick={() => onGenerate({ title, count, style })}>
          시안 4개 생성 →
        </button>
      </div>
    </div>
  )
}

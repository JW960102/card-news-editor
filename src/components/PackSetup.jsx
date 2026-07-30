import { useState } from 'react'
import { PACKS } from '../data/packs.js'

// ② 설정 — 제목 + 장수만 정하면 그 팩 블록을 조합해 시안을 만든다.
const ui = { fontFamily: 'sans-serif' }

export default function PackSetup({ packId, onBack, onGenerate }) {
  const pack = PACKS[packId]
  const [title, setTitle] = useState('')
  const [count, setCount] = useState(5)
  if (!pack) return null

  return (
    <div style={{ minHeight: '100%', background: '#f4f4f5', padding: 40, ...ui }}>
      <button onClick={onBack} style={{ height: 32, padding: '0 14px', borderRadius: 8, border: '0.5px solid #ccc', background: '#fff', marginBottom: 24 }}>← 스타일</button>
      <div style={{ maxWidth: 460 }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 6 }}>{pack.label} 스타일로 만들기</h1>
        <p style={{ color: '#666', marginBottom: 28, fontSize: 14 }}>제목과 장수만 정하면 시안 4개를 조합해 드려요. 글은 나중에 채우면 돼요.</p>

        <label style={{ display: 'block', marginBottom: 20 }}>
          <span style={{ display: 'block', fontSize: 13, color: '#555', marginBottom: 6 }}>주제 / 제목</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 부부의 날"
            style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '0.5px solid #ccc', fontSize: 15, boxSizing: 'border-box' }} />
        </label>

        <label style={{ display: 'block', marginBottom: 28 }}>
          <span style={{ display: 'block', fontSize: 13, color: '#555', marginBottom: 6 }}>카드 수</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {[3, 4, 5, 6, 7].map((n) => (
              <button key={n} onClick={() => setCount(n)}
                style={{ width: 44, height: 40, borderRadius: 8, border: '0.5px solid ' + (count === n ? '#111' : '#ccc'), background: count === n ? '#111' : '#fff', color: count === n ? '#fff' : '#333', fontWeight: 500 }}>{n}</button>
            ))}
          </div>
        </label>

        <button onClick={() => onGenerate({ title, count })}
          style={{ height: 46, padding: '0 24px', borderRadius: 10, background: '#111', color: '#fff', border: 'none', fontWeight: 500, fontSize: 15 }}>
          시안 4개 생성 →
        </button>
      </div>
    </div>
  )
}

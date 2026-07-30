import { useRef, useLayoutEffect } from 'react'
import EditableText from './EditableText.jsx'

// 카드 1장 렌더러 — 요소배열을 설계 px→cqw 로 환산해 절대배치.
// 텍스트는 FitText 로 박스(w×h)에 맞춰 자동 축소(넘침 방지).
const FONT = { display: 'var(--font-display)', body: 'var(--font-body)' }
const VALIGN = { top: 'flex-start', center: 'center', bottom: 'flex-end' }
const MIN_SIZE = 10 // 설계 px 최소 글자 크기

// 박스(w×h)가 있으면 스크롤높이/폭을 재서 들어갈 때까지 글자 크기를 이진탐색으로 축소.
function FitText({ e, cq }) {
  const boxRef = useRef(null)
  const innerRef = useRef(null)
  const hasBox = e.h != null

  useLayoutEffect(() => {
    if (!hasBox) return
    const box = boxRef.current, inner = innerRef.current
    if (!box || !inner) return
    const fits = () => inner.scrollHeight <= box.clientHeight + 1 && inner.scrollWidth <= box.clientWidth + 1
    inner.style.fontSize = cq(e.size)
    if (fits()) return
    let lo = MIN_SIZE, hi = e.size, best = MIN_SIZE
    for (let i = 0; i < 14; i++) {
      const mid = (lo + hi) / 2
      inner.style.fontSize = cq(mid)
      if (fits()) { best = mid; lo = mid } else { hi = mid }
    }
    inner.style.fontSize = cq(best)
  }, [e.content, e.size, e.w, e.h, e.lh, e.align]) // 위치(x,y) 변경 땐 재측정 안 함

  const inner = {
    width: '100%', fontFamily: FONT[e.font] || FONT.display,
    fontWeight: e.weight, fontSize: cq(e.size), color: e.color,
    textAlign: e.align, letterSpacing: '-0.03em', lineHeight: e.lh || 1.2,
  }
  if (!hasBox) // 박스 높이 없으면 그냥 흐름 배치 (축소 안 함)
    return <div style={{ position: 'absolute', left: cq(e.x), top: cq(e.y), width: cq(e.w), ...inner }}>{e.content}</div>

  return (
    <div ref={boxRef} style={{ position: 'absolute', left: cq(e.x), top: cq(e.y), width: cq(e.w), height: cq(e.h), overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: VALIGN[e.valign] || 'center' }}>
      <div ref={innerRef} style={inner}>{e.content}</div>
    </div>
  )
}

function Bar({ e, U }) {
  const cq = (px) => `${(px / U).toFixed(3)}cqw`
  const max = Math.max(1, ...e.items.map((it) => it.value))
  return (
    <div style={{ position: 'absolute', left: cq(e.x), top: cq(e.y), width: cq(e.w), height: cq(e.h), display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: cq(28), borderBottom: `${cq(3)} solid var(--card-neutral)` }}>
        {e.items.map((it, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
            <span style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: cq(34), color: e.color, marginBottom: cq(12) }}>{it.value}{e.unit || ''}</span>
            <div style={{ width: '68%', height: `max(${cq(12)}, ${(it.value / max) * 100}%)`, background: e.color, borderRadius: `${cq(12)} ${cq(12)} 0 0` }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: cq(28), marginTop: cq(18) }}>
        {e.items.map((it, i) => (
          <span key={i} style={{ flex: 1, textAlign: 'center', fontFamily: FONT.body, fontSize: cq(28), color: 'var(--card-sub)' }}>{it.label}</span>
        ))}
      </div>
    </div>
  )
}

export default function Stage({ card, canvas, editable = false, onText }) {
  const U = canvas.w / 100 // cqw 환산 단위 (1cqw = 카드폭 1%)
  const cq = (px) => `${(px / U).toFixed(3)}cqw`
  const abs = (e) => ({
    position: 'absolute', left: cq(e.x), top: cq(e.y),
    ...(e.w != null ? { width: cq(e.w) } : {}),
    ...(e.h != null ? { height: cq(e.h) } : {}),
  })

  return (
    <>
      {card.elements.map((e) => {
        if (e.type === 'shape')
          return <div key={e.id} style={{ ...abs(e), background: e.fill, borderRadius: cq(e.radius || 0) }} />

        if (e.type === 'image')
          return (
            <div key={e.id} style={{ ...abs(e), background: e.src ? 'none' : 'rgba(0,0,0,0.06)', borderRadius: cq(e.radius || 0), overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {e.src
                ? <img src={e.src} alt="" style={{ width: '100%', height: '100%', objectFit: e.fit || 'cover', display: 'block' }} />
                : <span style={{ fontSize: cq(34), color: 'var(--card-sub)', opacity: 0.55 }}>이미지</span>}
            </div>
          )

        if (e.type === 'bar') return <Bar key={e.id} e={e} U={U} />

        // text
        if (editable && onText) {
          const tstyle = { ...abs(e), fontFamily: FONT[e.font] || FONT.display, fontWeight: e.weight, fontSize: cq(e.size), color: e.color, textAlign: e.align, letterSpacing: '-0.03em', lineHeight: e.lh || 1.2 }
          return <EditableText key={e.id} value={e.content} onChange={(v) => onText(e.id, v)} style={tstyle} />
        }
        return <FitText key={e.id} e={e} cq={cq} />
      })}
    </>
  )
}

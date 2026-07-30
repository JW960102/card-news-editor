import EditableText from '../EditableText.jsx'

// 스카이 팩 (1:1, 824 기준). c(px) = px ÷ 8.24 = cqw.
const U = 8.24
const c = (px) => `${(px / U).toFixed(2)}cqw`
const box = (x, y, w, h, extra = {}) => ({ position: 'absolute', left: c(x), top: c(y), width: c(w), height: c(h), boxSizing: 'border-box', ...extra })
const tL = (x, y, extra = {}) => ({ position: 'absolute', left: c(x), top: c(y), whiteSpace: 'nowrap', fontFamily: 'var(--font-display)', ...extra })
const tC = (x, y, extra = {}) => ({ position: 'absolute', left: c(x), top: c(y), transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap', fontFamily: 'var(--font-display)', ...extra })
const CX = 412 // 카드 가로 중심

function Header({ s, set }) {
  return (
    <>
      <EditableText value={s.line1} onChange={set('line1')} style={tC(CX, 45, { fontWeight: 400, fontSize: c(34), color: '#fff' })} />
      <EditableText value={s.line2} onChange={set('line2')} style={tC(CX, 89, { fontWeight: 800, fontSize: c(74.6), letterSpacing: '-0.04em', color: '#fff' })} />
    </>
  )
}
function Dot({ x, y, n }) {
  return <div style={box(x, y, 33, 33, { borderRadius: '50%', background: 'var(--card-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: c(17), fontWeight: 700 })}>{n}</div>
}
function ImgSlot(props) {
  return <div style={box(props.x, props.y, props.w, props.h, { background: '#d9d9d9', borderRadius: c(props.r ?? 10), display: 'flex', alignItems: 'center', justifyContent: 'center' })}><span style={{ fontSize: c(20), color: '#8a8a8a' }}>이미지</span></div>
}

export default function SkyCard({ card, onSlot }) {
  const s = card.slots
  const set = (k) => (v) => onSlot && onSlot(k, v)

  switch (card.templateId) {
    case 'cover':
      return (
        <>
          <div style={{ position: 'absolute', inset: 0, background: '#014864' }} />
          <div style={box(236, 62, 351, 122, { background: '#d3fbff', borderRadius: c(61) })} />
          <EditableText value={s.badge} onChange={set('badge')} style={tC(CX, 73, { fontWeight: 900, fontSize: c(84), color: '#177ca4', letterSpacing: '-0.04em' })} />
          <EditableText value={s.title} onChange={set('title')} style={tC(CX, 207, { fontWeight: 900, fontSize: c(88), color: '#fff', letterSpacing: '-0.04em' })} />
        </>
      )

    case 'list':
      return (
        <>
          <Header s={s} set={set} />
          {s.items.map((it, i) => {
            const top = 195 + i * 120
            return (
              <div key={i}>
                <div style={box(64, top, 696, 108, { background: '#fff', borderRadius: c(20) })} />
                <Dot x={121} y={top + 37} n={i + 1} />
                <EditableText value={it.main} onChange={(v) => { const n = [...s.items]; n[i] = { ...it, main: v }; onSlot('items', n) }} style={tC(292, top + 37, { fontWeight: 700, fontSize: c(34), color: '#4b4b4b', letterSpacing: '-0.03em' })} />
                <div style={box(456, top + 32, 246, 43, { background: '#eeff9d', borderRadius: c(100) })} />
                <EditableText value={it.sub} onChange={(v) => { const n = [...s.items]; n[i] = { ...it, sub: v }; onSlot('items', n) }} style={tC(577, top + 42, { fontWeight: 700, fontSize: c(24), color: '#4d582e', letterSpacing: '-0.03em' })} />
              </div>
            )
          })}
          <EditableText value={s.foot} onChange={set('foot')} style={tC(CX, 711, { fontWeight: 500, fontSize: c(18), color: 'rgba(255,255,255,0.6)' })} />
        </>
      )

    case 'vs':
      return (
        <>
          <Header s={s} set={set} />
          <div style={box(49, 211, 352, 401, { background: '#fff', borderRadius: c(20) })} />
          <div style={box(422, 211, 352, 401, { background: '#fff', borderRadius: c(20) })} />
          <div style={box(120, 211, 211, 52, { background: '#e7e7e7', borderRadius: `0 0 ${c(20)} ${c(20)}` })} />
          <div style={box(493, 211, 211, 52, { background: '#f9ffa5', borderRadius: `0 0 ${c(20)} ${c(20)}` })} />
          <div style={tC(225, 222, { fontWeight: 600, fontSize: c(24), color: '#000' })}>BEFORE</div>
          <div style={tC(598, 222, { fontWeight: 600, fontSize: c(24), color: '#5c6741' })}>AFTER</div>
          {s.beforeItems.map((it, i) => (
            <div key={i}>
              <Dot x={98} y={299 + i * 82} n={i + 1} />
              <EditableText value={it} onChange={(v) => { const n = [...s.beforeItems]; n[i] = v; onSlot('beforeItems', n) }} style={tL(150, 292 + i * 82, { fontWeight: 600, fontSize: c(40), color: '#000', letterSpacing: '-0.04em' })} />
            </div>
          ))}
          <EditableText value={s.afterName} onChange={set('afterName')} style={tL(507, 364, { fontWeight: 600, fontSize: c(36), color: '#000', letterSpacing: '-0.04em' })} />
          <EditableText value={s.afterHighlight} onChange={set('afterHighlight')} style={tL(471, 407, { fontWeight: 700, fontSize: c(52), color: '#ff86c3', letterSpacing: '-0.04em' })} />
          <div style={box(84, 532, 282, 46, { background: '#e7e7e7', borderRadius: c(100) })} />
          <div style={box(457, 532, 282, 46, { background: '#d1fafe', borderRadius: c(100) })} />
          <EditableText value={s.beforeNote} onChange={set('beforeNote')} style={tC(225, 545, { fontWeight: 500, fontSize: c(20), color: '#6b6c6c' })} />
          <EditableText value={s.afterNote} onChange={set('afterNote')} style={tC(598, 545, { fontWeight: 500, fontSize: c(20), color: '#33848f' })} />
        </>
      )

    case 'qna':
      return (
        <>
          <div style={{ position: 'absolute', inset: 0, background: '#014864' }} />
          <Header s={s} set={set} />
          <div style={box(49, 211, 726, 506, { background: '#fff', borderRadius: c(20) })} />
          <div style={box(254, 211, 315, 52, { background: '#e7e7e7', borderRadius: `0 0 ${c(20)} ${c(20)}` })} />
          <EditableText value={s.tab} onChange={set('tab')} style={tC(411.5, 222, { fontWeight: 600, fontSize: c(24), color: '#5d5d5d' })} />
          {s.items.map((it, i) => {
            const qTop = 298 + i * 150
            return (
              <div key={i}>
                <Dot x={129} y={qTop + 1} n={i + 1} />
                <EditableText value={it.q} onChange={(v) => { const n = [...s.items]; n[i] = { ...it, q: v }; onSlot('items', n) }} style={tL(177, qTop, { fontWeight: 600, fontSize: c(32), color: '#000', letterSpacing: '-0.04em' })} />
                <EditableText value={it.a} onChange={(v) => { const n = [...s.items]; n[i] = { ...it, a: v }; onSlot('items', n) }} style={tL(210, qTop + 49, { fontWeight: 600, fontSize: c(20), color: '#b1b1b1', letterSpacing: '-0.04em' })} />
                {i < s.items.length - 1 && <div style={box(120, qTop + 110, 584, 0, { borderTop: '1px solid #eee' })} />}
              </div>
            )
          })}
          <EditableText value={s.foot} onChange={set('foot')} style={tC(411.5, 743, { fontWeight: 500, fontSize: c(18), color: 'rgba(255,255,255,0.6)' })} />
        </>
      )

    case 'triple':
      return (
        <>
          <Header s={s} set={set} />
          {s.cols.map((col, i) => {
            const left = 49.8 + i * 246.13
            return (
              <div key={i}>
                <div style={box(left, 211, 233.9, 350, { background: '#fff', borderRadius: c(17.5) })} />
                <div style={box(left + 38.4, 211, 157, 45.4, { background: '#e7e7e7', borderRadius: `0 0 ${c(17.5)} ${c(17.5)}` })} />
                <EditableText value={col.title} onChange={(v) => { const n = [...s.cols]; n[i] = { ...col, title: v }; onSlot('cols', n) }} style={tC(left + 117, 220.6, { fontWeight: 700, fontSize: c(24.4), color: '#626262', letterSpacing: '-0.03em' })} />
                <ImgSlot x={left + 57.4} y={286.9} w={120} h={154} r={0} />
                <EditableText value={col.cap} onChange={(v) => { const n = [...s.cols]; n[i] = { ...col, cap: v }; onSlot('cols', n) }} style={{ position: 'absolute', left: c(left + 117), top: c(478), transform: 'translateX(-50%)', textAlign: 'center', width: c(200), fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: c(24.4), color: '#464646', lineHeight: 1.3, letterSpacing: '-0.03em' }} />
              </div>
            )
          })}
        </>
      )

    case 'info':
      return (
        <>
          <Header s={s} set={set} />
          <div style={box(48, 211, 728, 268, { background: '#fff', borderRadius: c(17.5) })} />
          <div style={box(48, 211, 728, 58, { background: '#e7e7e7', borderRadius: `0 0 ${c(17.5)} ${c(17.5)}` })} />
          <EditableText value={s.tab} onChange={set('tab')} style={tC(411.5, 228, { fontWeight: 700, fontSize: c(24.4), color: '#626262', letterSpacing: '-0.03em' })} />
          <div style={box(412, 290, 0, 166.5, { borderLeft: '1px solid #ddd' })} />
          <EditableText value={s.leftHead} onChange={set('leftHead')} style={tC(233.5, 294, { fontWeight: 700, fontSize: c(42), color: '#767676', letterSpacing: '-0.03em' })} />
          <EditableText value={s.rightHead} onChange={set('rightHead')} style={tC(601.5, 294, { fontWeight: 700, fontSize: c(42), color: '#767676', letterSpacing: '-0.03em' })} />
          {s.leftLines.map((ln, i) => (
            <EditableText key={i} value={ln} onChange={(v) => { const n = [...s.leftLines]; n[i] = v; onSlot('leftLines', n) }} style={tC(233.5, 361 + i * 41, { fontWeight: 400, fontSize: c(24), color: '#000', letterSpacing: '-0.03em' })} />
          ))}
          {s.rightLines.map((ln, i) => (
            <EditableText key={i} value={ln} onChange={(v) => { const n = [...s.rightLines]; n[i] = v; onSlot('rightLines', n) }} style={tC(601, 361 + i * 42, { fontWeight: 400, fontSize: c(24), color: '#000', letterSpacing: '-0.03em' })} />
          ))}
        </>
      )

    default:
      return null
  }
}

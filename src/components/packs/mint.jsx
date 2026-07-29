import EditableText from '../EditableText.jsx'

// 민트 팩 템플릿 (실측 기반 절대배치, 단위 cqw = 카드폭 1%).
// 좌표/크기/폰트는 피그마 662폭 기준 px ÷ 6.62.

const cq = (n) => `${n}cqw`
const abs = (left, top, w, h, extra = {}) => ({
  position: 'absolute',
  left: cq(left), top: cq(top),
  ...(w != null ? { width: cq(w) } : {}),
  ...(h != null ? { height: cq(h) } : {}),
  ...extra,
})
// 가운데 정렬 텍스트
const absC = (top, w, extra = {}) => ({
  position: 'absolute', left: '50%', top: cq(top),
  transform: 'translateX(-50%)', textAlign: 'center',
  ...(w != null ? { width: cq(w) } : {}),
  ...extra,
})

function ImgSlot({ left, top, w, h, r = 1.5 }) {
  return (
    <div style={abs(left, top, w, h, { borderRadius: cq(r), background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
      <span style={{ fontSize: cq(3.2), color: 'var(--card-sub)', opacity: 0.5 }}>이미지</span>
    </div>
  )
}

export default function MintCard({ card, onSlot }) {
  const s = card.slots
  const set = (k) => (v) => onSlot && onSlot(k, v)

  switch (card.templateId) {
    case 'cover':
      return (
        <>
          <div style={abs(7.3, 6.6, 86.9, 55.6, { background: 'var(--card-surface)', borderRadius: cq(4.5) })} />
          <ImgSlot left={0.8} top={54.7} w={100} h={70.7} r={0} />
          <div style={abs(15.1, 48.3, 71.5, 6.3, { background: 'var(--card-neutral)', borderRadius: cq(15) })} />
          <EditableText value={s.date} onChange={set('date')}
            style={abs(30.5, 11.6, null, null, { fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: cq(12.1), color: 'var(--card-accent)', letterSpacing: '-0.05em', whiteSpace: 'nowrap' })} />
          <EditableText value={s.title} onChange={set('title')}
            style={abs(18.7, 24.9, null, null, { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: cq(18.1), color: 'var(--card-ink)', letterSpacing: '-0.04em', whiteSpace: 'nowrap' })} />
          <EditableText value={s.caption} onChange={set('caption')}
            style={abs(20.4, 49.4, 63, null, { fontFamily: 'var(--font-body)', fontSize: cq(3.3), color: 'var(--card-sub)', letterSpacing: '-0.03em' })} />
        </>
      )

    case 'body':
      return (
        <>
          <div style={abs(6.6, 6.5, 86.9, 111.8, { background: 'var(--card-surface)', borderRadius: cq(3) })} />
          <div style={abs(38.8, 13.1, 22.4, 6.6, { background: 'var(--card-accent)', borderRadius: cq(3.3), display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
            <EditableText value={s.label} onChange={set('label')}
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: cq(4.2), color: '#fff', letterSpacing: '-0.03em' }} />
          </div>
          <EditableText value={s.heading} onChange={set('heading')}
            style={absC(22.7, 78, { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: cq(9.1), color: 'var(--card-ink)', letterSpacing: '-0.03em', lineHeight: 1.05 })} />
          <EditableText value={s.body} onChange={set('body')}
            style={absC(45.8, 74.5, { fontFamily: 'var(--font-body)', fontSize: cq(3.6), color: 'var(--card-ink)', lineHeight: 1.4 })} />
          <ImgSlot left={32.8} top={65.4} w={34.4} h={28.7} />
          <div style={abs(14.2, 99.7, 71.8, 11.5, { background: 'var(--card-neutral)', borderRadius: cq(1.5) })} />
          <EditableText value={s.note} onChange={set('note')}
            style={absC(102.5, 66, { fontFamily: 'var(--font-body)', fontSize: cq(2.7), color: 'var(--card-ink)', letterSpacing: '-0.03em', lineHeight: 1.4 })} />
        </>
      )

    case 'item':
      return (
        <>
          <div style={abs(6.6, 6.5, 86.9, 111.8, { background: 'var(--card-surface)', borderRadius: cq(3) })} />
          <EditableText value={s.heading} onChange={set('heading')}
            style={absC(22.7, 78, { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: cq(9.1), color: 'var(--card-ink)', letterSpacing: '-0.03em' })} />
          <div style={abs(38.8, 13.1, 22.4, 6.6, { background: 'var(--card-accent)', borderRadius: cq(3.3), display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
            <EditableText value={s.label} onChange={set('label')}
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: cq(4.2), color: '#fff', letterSpacing: '-0.03em' }} />
          </div>
          <ImgSlot left={14.2} top={36.7} w={71.8} h={43.7} />
          <EditableText value={s.name} onChange={set('name')}
            style={absC(87.2, null, { fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: cq(4.2), color: 'var(--card-ink)', letterSpacing: '-0.03em', whiteSpace: 'nowrap' })} />
          <div style={abs(15.6, 84, 69, 26.9, { background: '#fff', border: `${cq(1.5)} solid var(--card-neutral)`, borderRadius: cq(1.5) })} />
          <EditableText value={s.caption} onChange={set('caption')}
            style={absC(99.5, 63.4, { fontFamily: 'var(--font-body)', fontSize: cq(3), color: 'var(--card-ink)', letterSpacing: '-0.03em', lineHeight: 1.4 })} />
        </>
      )

    case 'closing':
      return (
        <>
          <ImgSlot left={6.8} top={6} w={86.6} h={55.9} />
          <div style={abs(6.6, 66.8, 86.9, 50.8, { background: '#fff', borderRadius: cq(1.5) })} />
          <EditableText value={s.message} onChange={set('message')}
            style={absC(72.7, 76, { fontFamily: 'var(--font-body)', fontSize: cq(3.9), color: 'var(--card-ink)', letterSpacing: '-0.03em', lineHeight: 1.4 })} />
          <div style={abs(23.6, 92.9, 53, null, { borderTop: '1px solid var(--card-neutral)' })} />
          <EditableText value={s.title} onChange={set('title')}
            style={absC(96.1, null, { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: cq(5.7), color: 'var(--card-ink)', letterSpacing: '-0.03em', whiteSpace: 'nowrap' })} />
          <div style={abs(14.2, 106, 71.8, 5.9, { background: 'var(--card-neutral)', borderRadius: cq(1.5) })} />
          <EditableText value={s.quote} onChange={set('quote')}
            style={absC(107.3, null, { fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: cq(2.7), color: 'var(--card-ink)', letterSpacing: '-0.03em', whiteSpace: 'nowrap' })} />
        </>
      )

    default:
      return null
  }
}

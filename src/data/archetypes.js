import { CANVAS } from './styles.js'

// ┌ 아키타입 = 레이아웃 타입별 "요소 위치 계산 함수" ────────────────────┐
// │ build() → 요소배열. {x,y,w,h} 는 CANVAS(1080×1350) 설계 px.          │
// │ 텍스트에 h(할당 박스 높이)+valign 을 주면 렌더러가 넘칠 때 자동 축소. │
// │ 색은 var(--card-*) 참조 → 스타일 프리셋이 값을 채운다(룩/위치 분리). │
// └─────────────────────────────────────────────────────────────────────┘
const { w: W, h: H } = CANVAS
const M = 96               // 바깥 여백
const CW = W - M * 2       // 콘텐츠 폭 (888)
const CX = W / 2           // 가로 중심

// 모듈러 타입스케일
const TYPE = { display: 128, h1: 72, h2: 50, lead: 44, body: 38, cap: 28, kicker: 26 }

let uid = 0
const el = (o) => ({ id: `el_${uid++}`, ...o })
const text = (o) => el({ type: 'text', font: 'display', weight: 700, align: 'left', valign: 'center', color: 'var(--card-ink)', lh: 1.15, ...o })
const shape = (o) => el({ type: 'shape', fill: 'var(--card-surface)', radius: 0, ...o })
const image = (o) => el({ type: 'image', radius: 20, ...o })

// ── 표지 : 키커 + 큰 제목 + 룰 + 부제, 세로 중앙 정렬 ────────────────
function buildTitle() {
  return [
    text({ x: M, y: 440, w: CW, h: 40, size: TYPE.kicker, weight: 700, align: 'center', color: 'var(--card-accent)', content: '카테고리' }),
    text({ x: M, y: 496, w: CW, h: 240, size: TYPE.display, weight: 800, align: 'center', lh: 1.08, content: '제목을 입력하세요' }),
    shape({ x: CX - 70, y: 752, w: 140, h: 8, radius: 4, fill: 'var(--card-accent)' }),
    text({ x: M, y: 792, w: CW, h: 120, size: TYPE.lead, weight: 400, align: 'center', valign: 'top', font: 'body', color: 'var(--card-sub)', lh: 1.35, content: '부제목 · 한 줄 설명을 적어요' }),
  ]
}

// ── 카드형(본문) : 서피스 패널 + 라벨칩 + 소제목 + 본문 + 이미지 ──────
function buildCard() {
  const P = 76                    // 패널 안쪽 여백
  const iX = M + P                // 콘텐츠 시작 x (172)
  const iW = CW - P * 2           // 콘텐츠 폭 (736)
  const panelH = H - M * 2
  return [
    shape({ x: M, y: M, w: CW, h: panelH, radius: 44, fill: 'var(--card-surface)' }),
    shape({ x: iX, y: M + P, w: 156, h: 64, radius: 32, fill: 'var(--card-accent)' }),
    text({ x: iX, y: M + P, w: 156, h: 64, size: 30, weight: 700, align: 'center', color: '#ffffff', content: 'POINT' }),
    text({ x: iX, y: 280, w: iW, h: 150, size: TYPE.h1, weight: 700, valign: 'top', lh: 1.15, content: '소제목을 입력하세요' }),
    text({ x: iX, y: 456, w: iW, h: 266, size: TYPE.body, weight: 400, valign: 'top', font: 'body', lh: 1.5, content: '본문 내용을 입력하세요. 한 카드엔 한 가지 메시지만 담는 게 좋아요.' }),
    image({ x: iX, y: 752, w: iW, h: 430 }),
  ]
}

// ── 표형 : 제목 + 헤더 + 행(항목/값) + 구분선 ────────────────────────
function buildTable() {
  const rows = 4
  const headY = 340
  const top = 420
  const rowH = 150
  const valX = M + 560
  const out = [
    text({ x: M, y: 150, w: CW, h: 90, size: TYPE.h1, weight: 700, content: '표 제목' }),
    text({ x: M, y: headY, w: 400, h: 40, size: TYPE.cap, weight: 600, color: 'var(--card-sub)', content: '항목' }),
    text({ x: valX, y: headY, w: W - M - valX, h: 40, size: TYPE.cap, weight: 600, align: 'right', color: 'var(--card-sub)', content: '값' }),
    shape({ x: M, y: headY + 44, w: CW, h: 3, radius: 0, fill: 'var(--card-ink)' }),
  ]
  for (let i = 0; i < rows; i++) {
    const y = top + i * rowH
    out.push(text({ x: M, y, w: 500, h: rowH, size: TYPE.lead, weight: 500, content: `항목 ${i + 1}` }))
    out.push(text({ x: valX, y, w: W - M - valX, h: rowH, size: TYPE.h2, weight: 700, align: 'right', color: 'var(--card-accent)', content: '00' }))
    out.push(shape({ x: M, y: y + rowH - 2, w: CW, h: 2, radius: 0, fill: 'var(--card-neutral)' }))
  }
  return out
}

// ── 막대통계(그래프 뼈대) : 제목 + 막대 요소 ────────────────────────
function buildBar() {
  return [
    text({ x: M, y: 150, w: CW, h: 90, size: TYPE.h1, weight: 700, content: '통계 제목' }),
    el({
      type: 'bar', x: M, y: 380, w: CW, h: 800, color: 'var(--card-accent)', unit: '',
      items: [
        { label: '항목 A', value: 82 },
        { label: '항목 B', value: 57 },
        { label: '항목 C', value: 38 },
        { label: '항목 D', value: 21 },
      ],
    }),
  ]
}

// ── 마무리 : 메시지 + 룰 + CTA 알약 ─────────────────────────────────
function buildClosing() {
  return [
    text({ x: M, y: 500, w: CW, h: 150, size: TYPE.h2, weight: 500, align: 'center', font: 'body', lh: 1.4, content: '마무리 메시지를 입력하세요' }),
    shape({ x: CX - 160, y: 700, w: 320, h: 2, radius: 0, fill: 'var(--card-neutral)' }),
    shape({ x: CX - 170, y: 760, w: 340, h: 88, radius: 44, fill: 'var(--card-accent)' }),
    text({ x: CX - 170, y: 760, w: 340, h: 88, size: 36, weight: 700, align: 'center', color: '#ffffff', content: '자세히 보기 →' }),
  ]
}

export const ARCHETYPES = {
  title:   { label: '표지',     build: buildTitle },
  card:    { label: '카드형',   build: buildCard },
  table:   { label: '표형',     build: buildTable },
  bar:     { label: '막대통계', build: buildBar },
  closing: { label: '마무리',   build: buildClosing },
}
// 사용자가 중간 카드에 고를 수 있는 레이아웃 타입 (표지/마무리는 자동)
export const MID_TYPES = ['card', 'table', 'bar']

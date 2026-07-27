import html2canvas from 'html2canvas'

// EditorPage.jsx(다꾸 편집기) 938~987 내보내기 로직 수확 → 카드용 함수화.
// 카드 DOM 엘리먼트를 받아 고해상도 PNG dataURL 반환. (4:5, scale로 1080×1350 목표)
export async function captureCard(el, { scale = 3, background = '#ffffff' } = {}) {
  const canvas = await html2canvas(el, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: background,
    scale,
    logging: false,
    width: el.offsetWidth,
    height: el.offsetHeight,
  })
  return canvas.toDataURL('image/png')
}

// dataURL 다운로드 트리거
export function downloadDataURL(dataURL, filename) {
  const a = document.createElement('a')
  a.href = dataURL
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

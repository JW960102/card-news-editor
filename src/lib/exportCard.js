import html2canvas from 'html2canvas'

// 카드 DOM을 받아 고해상도 PNG dataURL 반환.
// 표시 크기가 달라도 항상 targetWidth(기본 1080) 기준으로 캡처 → 4:5면 1080×1350.
export async function captureCard(el, { targetWidth = 1080, background = '#ffffff' } = {}) {
  const scale = targetWidth / el.offsetWidth
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

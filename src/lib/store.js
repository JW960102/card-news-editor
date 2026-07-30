// 레이아웃 저장. localStorage + JSON 내보내기 + (설정 시) Supabase 백엔드.
import { saveRemote } from './backend.js'
const KEY = 'cn_layouts'

export function loadAll() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

// 덱 저장 (같은 id 있으면 갱신, 없으면 추가) → 저장된 전체 개수 반환
export function saveDeck(deck) {
  const all = loadAll()
  const rec = { ...deck, savedAt: new Date().toISOString() }
  const idx = all.findIndex((d) => d.id === deck.id)
  if (idx >= 0) all[idx] = rec
  else all.push(rec)
  try { localStorage.setItem(KEY, JSON.stringify(all)) }
  catch (e) { console.error('저장 실패(용량 초과 가능)', e); alert('저장 실패 — 이미지가 많으면 용량 한도를 넘을 수 있어요.') }
  // 백엔드가 설정돼 있으면 원격에도 누적 저장 (fire-and-forget, 실패해도 앱 안 멈춤)
  saveRemote(rec)
  return all.length
}

export function deleteSaved(id) {
  const all = loadAll().filter((d) => d.id !== id)
  localStorage.setItem(KEY, JSON.stringify(all))
  return all
}

export function exportDeck(deck) {
  const blob = new Blob([JSON.stringify(deck, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${deck.id}.json`
  a.click()
  URL.revokeObjectURL(url)
}

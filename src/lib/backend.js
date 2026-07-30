// Supabase 백엔드 연동 (REST, 의존성 없음).
// 아래 두 값을 채우면 활성화되고, 비어 있으면 자동으로 no-op(로컬 저장만).
// ⚠️ anon key 는 "공개용" 키라 클라이언트에 넣는 게 정상 (RLS 정책으로 보호).
const SUPABASE_URL = 'https://iuyphjeprynmgtdmrvwe.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_AE73rc8QgY6cIO-WkGZdzQ_yVCQLRpr'
const TABLE = 'layouts'

export const backendReady = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

const headers = () => ({
  'Content-Type': 'application/json',
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
})

// 덱 한 개를 백엔드에 저장(누적). 실패해도 앱은 안 멈춤(fire-and-forget).
export async function saveRemote(deck) {
  if (!backendReady()) return { ok: false, skipped: true }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: { ...headers(), Prefer: 'return=minimal' },
      body: JSON.stringify({
        deck_id: deck.id,
        style: deck.styleId,
        card_count: deck.cards?.length ?? 0,
        data: deck,
      }),
    })
    return { ok: res.ok, status: res.status }
  } catch (e) { console.error('원격 저장 실패', e); return { ok: false, error: String(e) } }
}

// 백엔드에 쌓인 덱들 불러오기 (최신순).
export async function loadRemote() {
  if (!backendReady()) return []
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?select=*&order=created_at.desc`, { headers: headers() })
    return res.ok ? await res.json() : []
  } catch (e) { console.error('원격 로드 실패', e); return [] }
}

// 백엔드에 쌓인 전체 개수 (대시보드 없이 앱에서 "N개 쌓임" 표시용).
export async function countRemote() {
  if (!backendReady()) return null
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?select=deck_id`, {
      headers: { ...headers(), Prefer: 'count=exact', Range: '0-0' },
    })
    const range = res.headers.get('content-range') // 형식: "0-0/123"
    return range ? Number(range.split('/')[1]) : null
  } catch (e) { console.error('원격 카운트 실패', e); return null }
}

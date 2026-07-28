import { useState, useCallback } from 'react'

// undo/redo 히스토리. present를 past/future 스택으로 관리.
// set(updater, tag): tag가 직전과 같으면 체크포인트를 새로 안 쌓고 present만 교체(연속 텍스트 입력 묶기).
// tag=null(기본)이면 항상 새 체크포인트(구조 변경용).
export function useHistory(initial) {
  const [h, setH] = useState({ past: [], present: initial, future: [], lastTag: null })

  const set = useCallback((updater, tag = null) => {
    setH((h) => {
      const next = typeof updater === 'function' ? updater(h.present) : updater
      if (next === h.present) return h
      if (tag !== null && tag === h.lastTag) {
        return { ...h, present: next, future: [] }
      }
      return { past: [...h.past, h.present].slice(-60), present: next, future: [], lastTag: tag }
    })
  }, [])

  const undo = useCallback(() => setH((h) => {
    if (!h.past.length) return h
    const prev = h.past[h.past.length - 1]
    return { past: h.past.slice(0, -1), present: prev, future: [h.present, ...h.future], lastTag: null }
  }), [])

  const redo = useCallback(() => setH((h) => {
    if (!h.future.length) return h
    const next = h.future[0]
    return { past: [...h.past, h.present], present: next, future: h.future.slice(1), lastTag: null }
  }), [])

  return { state: h.present, set, undo, redo, canUndo: h.past.length > 0, canRedo: h.future.length > 0 }
}

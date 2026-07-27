import { useRef, useEffect } from 'react'

// 커서 튐 방지 contenteditable.
// value가 DOM 텍스트와 다를 때만 DOM에 write → 타이핑 중엔 건드리지 않음.
export default function EditableText({ value, onChange, className, style, tag = 'div' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (el && el.textContent !== value) el.textContent = value
  }, [value])

  const Tag = tag
  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onInput={(e) => onChange(e.currentTarget.textContent)}
    />
  )
}

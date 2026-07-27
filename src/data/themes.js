// 테마 = 덱 전역 스타일 토큰 1벌 (일관성=카드 레벨 원칙).
// 각 테마는 CSS 변수로 카드에 주입된다. accent 배열 = Shuffle 색상 후보.
export const THEMES = {
  editorial: {
    label: 'Editorial',
    vars: {
      '--card-bg': '#ffffff',
      '--card-ink': '#111111',
      '--card-sub': '#6b6b6b',
      '--card-accent': '#111111',
      '--font-display': "'General Sans', sans-serif",
      '--font-body': "'Newsreader', serif",
    },
    accents: ['#111111', '#c8442a', '#1d4ed8', '#0f766e', '#b45309'],
  },
  mono: {
    label: 'Mono Dark',
    vars: {
      '--card-bg': '#111111',
      '--card-ink': '#f5f5f5',
      '--card-sub': '#9a9a9a',
      '--card-accent': '#d6ff1e',
      '--font-display': "'General Sans', sans-serif",
      '--font-body': "'General Sans', sans-serif",
    },
    accents: ['#d6ff1e', '#ff5a5f', '#4dd0e1', '#ffd166', '#c084fc'],
  },
  soft: {
    label: 'Soft',
    vars: {
      '--card-bg': '#f4efe6',
      '--card-ink': '#2b2622',
      '--card-sub': '#7a7167',
      '--card-accent': '#c0553b',
      '--font-display': "'General Sans', sans-serif",
      '--font-body': "'Newsreader', serif",
    },
    accents: ['#c0553b', '#4a7c59', '#2f5d8a', '#a67c00', '#8a5a83'],
  },
}

export const THEME_IDS = Object.keys(THEMES)

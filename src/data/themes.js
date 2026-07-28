// 테마 = 덱 전역 스타일 토큰 1벌 (일관성=카드 레벨 원칙).
// 각 배경(bg)에 가독성 맞춘 글자색(ink)·보조색(sub)·강조색(accent)을 짝지음.
// 소프트 배경은 컬러리스트 리서치 기반: 명도 높고 채도 낮은 톤(원색 아님).
const GS = "'General Sans', sans-serif"     // 영문 디스플레이
const NR = "'Newsreader', serif"            // 에디토리얼 세리프

export const THEMES = {
  editorial: {
    label: 'White',
    vars: {
      '--card-bg': '#ffffff', '--card-ink': '#111111', '--card-sub': '#6b6b6b',
      '--card-accent': '#111111', '--font-display': GS, '--font-body': NR,
    },
  },
  mono: {
    label: 'Dark',
    vars: {
      '--card-bg': '#111111', '--card-ink': '#f5f5f5', '--card-sub': '#9a9a9a',
      '--card-accent': '#d6ff1e', '--font-display': GS, '--font-body': GS,
    },
  },
  cream: {
    label: 'Cream',
    vars: {
      '--card-bg': '#fbf4e0', '--card-ink': '#3e3730', '--card-sub': '#8a7f6e',
      '--card-accent': '#c58b2e', '--font-display': GS, '--font-body': NR,
    },
  },
  blush: {
    label: 'Blush',
    vars: {
      '--card-bg': '#fbecef', '--card-ink': '#4a3b40', '--card-sub': '#9b8288',
      '--card-accent': '#c25b72', '--font-display': GS, '--font-body': NR,
    },
  },
  sky: {
    label: 'Sky',
    vars: {
      '--card-bg': '#e9f2fb', '--card-ink': '#1f2a38', '--card-sub': '#66758a',
      '--card-accent': '#2f6fbf', '--font-display': GS, '--font-body': NR,
    },
  },
  sage: {
    label: 'Sage',
    vars: {
      '--card-bg': '#e9f3eb', '--card-ink': '#273229', '--card-sub': '#6e7c70',
      '--card-accent': '#3e7d5a', '--font-display': GS, '--font-body': NR,
    },
  },
  lavender: {
    label: 'Lavender',
    vars: {
      '--card-bg': '#f0ecf9', '--card-ink': '#302a3d', '--card-sub': '#7c7488',
      '--card-accent': '#6c4cb0', '--font-display': GS, '--font-body': NR,
    },
  },
  oat: {
    label: 'Oat',
    vars: {
      '--card-bg': '#f4efe6', '--card-ink': '#2e2a24', '--card-sub': '#7a7266',
      '--card-accent': '#8a6d3b', '--font-display': GS, '--font-body': NR,
    },
  },
}

export const THEME_IDS = Object.keys(THEMES)

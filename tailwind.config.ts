import type { Config } from 'tailwindcss'

/** Content paths for editors & tooling. Tailwind v4 primary config lives in `app/globals.css`. */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
} satisfies Config

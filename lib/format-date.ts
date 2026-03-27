const UTC_MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

const UTC_MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

type ArticleDateStyle = 'short' | 'long'

/** Calendar date in UTC — deterministic on server and client (no `toLocaleDateString`). */
export function formatArticleDate(
  iso: string | null | undefined,
  style: ArticleDateStyle = 'short',
): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const m =
    style === 'long' ? UTC_MONTHS_LONG[d.getUTCMonth()]! : UTC_MONTHS_SHORT[d.getUTCMonth()]!
  const day = d.getUTCDate()
  const y = d.getUTCFullYear()
  return `${m} ${day}, ${y}`
}

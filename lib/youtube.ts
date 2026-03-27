/** YouTube video IDs are typically 11 characters. */
export function isLikelyYouTubeVideoId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(id.trim())
}

export function youtubeVideoUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id.trim()}`
}

export function youtubeThumbnailUrl(id: string): string | null {
  if (!isLikelyYouTubeVideoId(id)) return null
  return `https://img.youtube.com/vi/${id.trim()}/hqdefault.jpg`
}

export function youtubeChannelUrl(id: string): string {
  const t = id.trim()
  if (t.startsWith('UC') && t.length >= 22) return `https://www.youtube.com/channel/${t}`
  return youtubeVideoUrl(t)
}

/** Prefer watch URL for video IDs; channel URL for typical channel IDs. */
export function resolveYoutubeHref(id: string | null | undefined, fallbackName: string): string {
  if (!id?.trim()) {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(fallbackName)}`
  }
  const t = id.trim()
  if (isLikelyYouTubeVideoId(t)) return youtubeVideoUrl(t)
  if (t.startsWith('UC') && t.length >= 22) return youtubeChannelUrl(t)
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(fallbackName)}`
}

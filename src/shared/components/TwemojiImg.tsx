interface Props { emoji: string; size?: number; alt?: string }

// Convert emoji char to Twemoji CDN SVG URL
function toCodePoint(emoji: string): string {
  const points: string[] = []
  for (const ch of emoji) {
    const cp = ch.codePointAt(0)
    if (cp) points.push(cp.toString(16))
  }
  return points.join('-')
}

function twemojiUrl(emoji: string): string {
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/${toCodePoint(emoji)}.svg`
}

export function TwemojiImg({ emoji, size = 32, alt = '' }: Props) {
  const src = twemojiUrl(emoji)
  return (
    <img
      src={src}
      alt={alt || emoji}
      width={size}
      height={size}
      style={{ display:'inline-block',verticalAlign:'middle' }}
      loading="lazy"
    />
  )
}

export function getTwemojiUrl(emoji: string): string {
  return twemojiUrl(emoji)
}

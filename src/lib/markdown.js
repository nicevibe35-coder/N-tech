/**
 * A small, safe Markdown parser. It produces plain data (never HTML strings),
 * so the renderer builds React elements and nothing can inject markup.
 * Supported: headings, paragraphs, fenced code, lists, quotes, `code`,
 * **bold**, *italic* and [links](https://example.com).
 */

const FENCE = /^```(\w*)\s*$/
const FENCE_END = /^```\s*$/
const HEADING = /^(#{1,4})\s+(.*)$/
const QUOTE = /^>\s?/
const BULLET = /^[-*]\s+(.*)$/
const NUMBERED = /^\d+\.\s+(.*)$/
const INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)|(\[[^\]]+\]\([^)\s]+\))/g
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/

export function safeHref(href) {
  return /^(https?:\/\/|mailto:|\/|#)/i.test(href) ? href : null
}

export function parseInline(text) {
  const nodes = []
  let cursor = 0

  for (const match of text.matchAll(INLINE)) {
    const index = match.index ?? 0
    if (index > cursor) nodes.push({ type: 'text', value: text.slice(cursor, index) })
    const token = match[0]

    if (match[1]) {
      nodes.push({ type: 'code', value: token.slice(1, -1) })
    } else if (match[2]) {
      nodes.push({ type: 'strong', children: parseInline(token.slice(2, -2)) })
    } else if (match[3]) {
      nodes.push({ type: 'em', children: parseInline(token.slice(1, -1)) })
    } else {
      const link = LINK.exec(token)
      const href = link ? safeHref(link[2]) : null
      if (link && href) nodes.push({ type: 'link', href, children: parseInline(link[1]) })
      else nodes.push({ type: 'text', value: token })
    }
    cursor = index + token.length
  }

  if (cursor < text.length) nodes.push({ type: 'text', value: text.slice(cursor) })
  return nodes
}

function startsBlock(line) {
  return FENCE.test(line) || HEADING.test(line) || QUOTE.test(line) || BULLET.test(line) || NUMBERED.test(line)
}

export function parseMarkdown(source) {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') {
      i += 1
      continue
    }

    const fence = FENCE.exec(line)
    if (fence) {
      const code = []
      i += 1
      while (i < lines.length && !FENCE_END.test(lines[i])) {
        code.push(lines[i])
        i += 1
      }
      i += 1
      blocks.push({ type: 'code', language: fence[1], value: code.join('\n') })
      continue
    }

    const heading = HEADING.exec(line)
    if (heading) {
      const hashes = heading[1].length
      const level = hashes <= 2 ? 2 : hashes === 3 ? 3 : 4
      blocks.push({ type: 'heading', level, children: parseInline(heading[2].trim()) })
      i += 1
      continue
    }

    if (QUOTE.test(line)) {
      const quote = []
      while (i < lines.length && QUOTE.test(lines[i])) {
        quote.push(lines[i].replace(QUOTE, '').trim())
        i += 1
      }
      blocks.push({ type: 'quote', children: parseInline(quote.join(' ')) })
      continue
    }

    const ordered = NUMBERED.test(line)
    if (ordered || BULLET.test(line)) {
      const pattern = ordered ? NUMBERED : BULLET
      const items = []
      while (i < lines.length) {
        const item = pattern.exec(lines[i])
        if (!item) break
        items.push(parseInline(item[1].trim()))
        i += 1
      }
      blocks.push({ type: 'list', ordered, items })
      continue
    }

    const paragraph = []
    while (i < lines.length && lines[i].trim() !== '' && !startsBlock(lines[i])) {
      paragraph.push(lines[i].trim())
      i += 1
    }
    blocks.push({ type: 'paragraph', children: parseInline(paragraph.join(' ')) })
  }

  return blocks
}

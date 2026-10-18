/** Reads a `---` delimited block of `key: value` lines from the top of a Markdown file. */
export function parseFrontmatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source)
  if (!match) return { data: {}, body: source }

  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(':')
    if (colon < 1) continue
    data[line.slice(0, colon).trim()] = line.slice(colon + 1).trim()
  }
  return { data, body: match[2] }
}

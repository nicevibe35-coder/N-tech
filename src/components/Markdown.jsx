import { Fragment, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { parseMarkdown } from '../lib/markdown'
import { CodeBlock } from './CodeBlock'

const LINK_CLASS = 'font-medium text-ink underline underline-offset-4 hover:opacity-80'

function renderInline(nodes) {
  return nodes.map((node, index) => {
    switch (node.type) {
      case 'text':
        return <Fragment key={index}>{node.value}</Fragment>
      case 'code':
        return (
          <code key={index} className="rounded bg-subtle px-1.5 py-0.5 font-mono text-[0.9em] text-ink">
            {node.value}
          </code>
        )
      case 'strong':
        return (
          <strong key={index} className="font-semibold">
            {renderInline(node.children)}
          </strong>
        )
      case 'em':
        return <em key={index}>{renderInline(node.children)}</em>
      case 'link':
        return node.href.startsWith('/') ? (
          <Link key={index} to={node.href} className={LINK_CLASS}>
            {renderInline(node.children)}
          </Link>
        ) : (
          <a key={index} href={node.href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
            {renderInline(node.children)}
          </a>
        )
    }
  })
}

function renderBlock(block, index) {
  switch (block.type) {
    case 'heading': {
      const Heading = block.level === 2 ? 'h2' : block.level === 3 ? 'h3' : 'h4'
      const size = block.level === 2 ? 'mt-12 text-2xl' : block.level === 3 ? 'mt-8 text-xl' : 'mt-6 text-lg'
      return (
        <Heading key={index} className={`${size} font-semibold tracking-tight text-ink`}>
          {renderInline(block.children)}
        </Heading>
      )
    }
    case 'paragraph':
      return <p key={index}>{renderInline(block.children)}</p>
    case 'code':
      return <CodeBlock key={index} value={block.value} language={block.language} />
    case 'list': {
      const List = block.ordered ? 'ol' : 'ul'
      return (
        <List key={index} className={`space-y-2 pl-6 ${block.ordered ? 'list-decimal' : 'list-disc'}`}>
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex} className="pl-1">
              {renderInline(item)}
            </li>
          ))}
        </List>
      )
    }
    case 'quote':
      return (
        <blockquote key={index} className="border-l-2 border-ink pl-4 text-muted">
          {renderInline(block.children)}
        </blockquote>
      )
  }
}

export function Markdown({ source }) {
  const blocks = useMemo(() => parseMarkdown(source), [source])
  return <div className="space-y-5 leading-relaxed text-ink">{blocks.map(renderBlock)}</div>
}

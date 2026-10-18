import { Link } from 'react-router-dom'
import { plural } from '../lib/format'

import { AuthorLine } from './AuthorLine'
import { Tag } from './ui/Tag'

export function ProjectCard({ project }) {
  return (
    <article className="flex flex-col rounded-lg border border-line p-5 transition-colors hover:bg-subtle">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-ink">
          <Link to={`/projects/${project.id}`} className="hover:underline">
            {project.title}
          </Link>
        </h3>
        <Tag strong={project.status === 'open'}>{project.status === 'open' ? 'Open' : 'Closed'}</Tag>
      </div>

      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{project.summary}</p>

      <ul aria-label="Technologies" className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <li key={item}>
            <Tag>{item}</Tag>
          </li>
        ))}
      </ul>

      {project.roles.length > 0 ? (
        <p className="mt-3 text-sm text-muted">
          <span className="font-medium text-ink">Looking for:</span> {project.roles.join(', ')}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <AuthorLine author={project.owner} />
        <p className="text-xs text-muted">{plural(project.members.length + 1, 'member')}</p>
      </div>
    </article>
  )
}

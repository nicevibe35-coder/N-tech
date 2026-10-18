export const CATEGORIES = {
  F: { label: 'Foundations', hue: 150 },
  FE: { label: 'Frontend', hue: 160 },
  BE: { label: 'Backend', hue: 215 },
  D: { label: 'Data & BaaS', hue: 35 },
  M: { label: 'Mobile', hue: 280 },
  C: { label: 'Cloud & Ops', hue: 195 },
  S: { label: 'Security', hue: 350 },
}

// [id, title, badge, category, tagName, items, iconKey]
// iconKey maps to an entry in ICONS below.
export const TRACKS = [
  ['git', 'Git & GitHub', 'GT', 'F', 'Commit Captain',
    ['Init, commit, branch', 'Merge and fix conflicts', 'Pull requests', 'Open-source contribution'],
    'github'],
  ['html', 'HTML & CSS', 'HC', 'F', 'Markup Maker',
    ['Semantic HTML and forms', 'Flexbox and Grid', 'Responsive, mobile-first', 'Accessibility basics', 'CSS variables and animation'],
    'html'],
  ['js', 'JavaScript', 'JS', 'F', 'Script Slinger',
    ['ES6+ syntax', 'DOM and events', 'Promises and async/await', 'Closures and modules', 'Debugging and error handling'],
    'javascript'],
  ['ts', 'TypeScript', 'TS', 'FE', 'Type Tamer',
    ['Types and interfaces', 'Generics', 'Narrowing', 'Typing API responses', 'tsconfig basics'],
    'typescript'],
  ['react', 'React', 'RE', 'FE', 'Component Crafter',
    ['Components and props', 'State and effects', 'Custom hooks', 'Routing', 'Data fetching states'],
    'react'],
  ['next', 'Next.js', 'NX', 'FE', 'Route Ranger',
    ['App router', 'Server vs client components', 'Data fetching and caching', 'API routes', 'Deploy'],
    'nextjs'],
  ['node', 'Node & Express', 'NE', 'BE', 'Server Shaper',
    ['Node and npm', 'REST routes', 'Middleware', 'Validation and errors', 'Env config'],
    'nodejs'],
  ['sql', 'SQL & Postgres', 'SQ', 'D', 'Query Knight',
    ['SELECT, WHERE, ORDER BY', 'JOINs', 'GROUP BY and aggregates', 'Schema design', 'Indexes and transactions'],
    'postgres'],
  ['mongo', 'MongoDB', 'MG', 'D', 'Document Diver',
    ['CRUD', 'Schema design', 'Queries and indexes', 'Aggregation pipeline', 'Mongoose'],
    'mongodb'],
  ['fire', 'Firebase', 'FB', 'D', 'Flame Keeper',
    ['Auth', 'Firestore CRUD', 'Security rules', 'Hosting', 'Cloud Functions'],
    'firebase'],
  ['supa', 'Supabase', 'SB', 'D', 'Row Guardian',
    ['Project and CRUD', 'Auth and sessions', 'Row Level Security', 'Storage and realtime', 'Test RLS as other users'],
    'supabase'],
  ['rn', 'React Native', 'RN', 'M', 'Pocket Builder',
    ['Core components and styling', 'Navigation', 'Device APIs', 'State and data', 'Build and publish with Expo'],
    'reactnative'],
  ['linux', 'Linux & CLI', 'LX', 'C', 'Terminal Tamer',
    ['Files and navigation', 'Permissions', 'Processes and logs', 'Shell scripting', 'SSH'],
    'linux'],
  ['docker', 'Docker & CI/CD', 'DK', 'C', 'Container Captain',
    ['Images and containers', 'Compose', 'Volumes and env', 'CI pipeline', 'Automated deploy'],
    'docker'],
  ['aws', 'AWS', 'AW', 'C', 'Cloud Climber',
    ['IAM', 'EC2', 'S3 and CloudFront', 'RDS or DynamoDB', 'Lambda'],
    'amazonwebservices'],
  ['sec', 'Web Security', 'WS', 'S', 'Shield Bearer',
    ['OWASP Top 10', 'XSS and CSRF', 'Auth and session security', 'Injection', 'Testing and recon basics'],
    'security'],
]

export const CAREERS = [
  ['Frontend Developer', ['html', 'js', 'react']],
  ['Backend Developer', ['node', ['sql', 'mongo']]],
  ['Mobile Developer', ['js', 'react', 'rn']],
  ['Cloud Engineer', ['linux', 'docker', 'aws']],
  ['Security Specialist', ['html', 'js', 'sec']],
  ['Full-Stack Developer', ['html', 'js', 'react', 'node', ['sql', 'mongo', 'fire', 'supa']]],
]

export const LEVELS = [
  [0, 'Newcomer'],
  [1, 'Initiate'],
  [2, 'Apprentice'],
  [4, 'Builder'],
  [7, 'Stack Wrangler'],
  [10, 'Polyglot Engineer'],
  [14, 'Legend'],
]

export function getTrack(id) {
  return TRACKS.find((t) => t[0] === id) ?? null
}

export function getCategory(code) {
  return CATEGORIES[code] ?? { label: code, hue: 0 }
}
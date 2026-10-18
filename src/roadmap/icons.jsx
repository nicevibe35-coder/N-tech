import {
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiMongodb,
  SiFirebase,
  SiSupabase,
  SiLinux,
  SiDocker,
} from 'react-icons/si'
import { TbShieldLock, TbCloud } from 'react-icons/tb'

const MAP = {
  github: SiGithub,
  html: SiHtml5,
  javascript: SiJavascript,
  typescript: SiTypescript,
  react: SiReact,
  nextjs: SiNextdotjs,
  nodejs: SiNodedotjs,
  postgres: SiPostgresql,
  mongodb: SiMongodb,
  firebase: SiFirebase,
  supabase: SiSupabase,
  linux: SiLinux,
  docker: SiDocker,
  amazonwebservices: TbCloud,
  security: TbShieldLock,
}

export function TrackIcon({ name, className = 'size-5' }) {
  const Icon = MAP[name] ?? TbShieldLock
  return <Icon className={className} aria-hidden="true" />
}
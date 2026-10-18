import { CAREERS, LEVELS, TRACKS } from './data'

export function itemKey(trackId, index) {
  return `${trackId}.${index}`
}

export function countDone(track, done) {
  let count = 0
  track[5].forEach((_, i) => {
    if (done[itemKey(track[0], i)]) count += 1
  })
  return count
}

export function isTrackEarned(track, done) {
  return countDone(track, done) === track[5].length
}

export function hasTrack(trackId, done) {
  const track = TRACKS.find((t) => t[0] === trackId)
  return track ? isTrackEarned(track, done) : false
}

export function careerEarned(career, done) {
  return career[1].every((req) =>
    Array.isArray(req) ? req.some((id) => hasTrack(id, done)) : hasTrack(req, done),
  )
}

export function currentTitle(done) {
  let bestCareer = null
  for (const career of CAREERS) {
    if (careerEarned(career, done)) {
      if (!bestCareer || career[1].length >= bestCareer[1].length) {
        bestCareer = career
      }
    }
  }
  if (bestCareer) return bestCareer[0]

  const earned = TRACKS.filter((t) => isTrackEarned(t, done)).length
  let title = ''
  for (const [threshold, name] of LEVELS) {
    if (earned >= threshold) title = name
  }
  return title
}

export function totalEarned(done) {
  return TRACKS.filter((t) => isTrackEarned(t, done)).length
}
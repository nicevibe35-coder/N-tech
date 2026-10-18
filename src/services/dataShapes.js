/**
 * The shape of every record the services read and write. This file holds
 * documentation only; it is a map for when the storage moves to a database.
 *
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username     lowercase letters, numbers, underscores (3 to 20)
 * @property {string} displayName
 * @property {string} bio
 * @property {string} website      empty, or a full http(s) link
 * @property {string} createdAt    ISO date string
 *
 * @typedef {Object} Post
 * @property {string} id
 * @property {string} authorId
 * @property {string} body
 * @property {string} code         optional code snippet, empty when none
 * @property {string} createdAt
 *
 * @typedef {'post' | 'blog' | 'lesson' | 'project'} TargetKind
 *
 * @typedef {Object} Target        anything people can like or comment on
 * @property {TargetKind} kind
 * @property {string} id           post id, blog slug, "track/lesson", or project id
 *
 * @typedef {Object} Comment
 * @property {string} id
 * @property {TargetKind} targetKind
 * @property {string} targetId
 * @property {string} authorId
 * @property {string} body
 * @property {string} createdAt
 *
 * @typedef {Object} Like
 * @property {TargetKind} targetKind
 * @property {string} targetId
 * @property {string} userId
 *
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} ownerId
 * @property {string} title
 * @property {string} summary
 * @property {string[]} stack
 * @property {string[]} roles
 * @property {'open' | 'closed'} status
 * @property {string} createdAt
 *
 * @typedef {Object} JoinRequest
 * @property {string} id
 * @property {string} projectId
 * @property {string} userId
 * @property {string} message
 * @property {'pending' | 'accepted' | 'declined'} status
 * @property {string} createdAt
 *
 * @typedef {Object} ProgressEntry
 * @property {string} userId
 * @property {string} trackSlug
 * @property {string} lessonSlug
 * @property {string} completedAt
 *
 * @typedef {Object} Bookmark
 * @property {string} userId
 * @property {'blog' | 'lesson' | 'material'} kind
 * @property {string} ref          blog slug, "track/lesson", or material id
 * @property {string} createdAt
 */
export {}

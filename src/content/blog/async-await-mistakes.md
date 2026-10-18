---
title: Three async/await mistakes I see all the time
date: 2026-10-08
summary: Forgetting to await, running independent work one step at a time, and swallowing errors. Each one is easy to fix once you can spot it.
tags: javascript, async
---

`async` and `await` make asynchronous code read like normal code. That is also why small mistakes hide so well. These are the three I see most.

## 1. Forgetting to await

```js
async function loadProfile() {
  const response = fetch('/api/profile') // missing await
  const data = await response.json()     // TypeError
  return data
}
```

Without `await`, `response` is a promise, not a response. The fix is one word:

```js
const response = await fetch('/api/profile')
```

If a value looks like `Promise { <pending> }` in your logs, you forgot an `await` somewhere.

## 2. Waiting for things one at a time

```js
const user = await getUser()
const posts = await getPosts()
const stats = await getStats()
```

If those three calls do not depend on each other, this makes you wait for the sum of all three. Start them together instead:

```js
const [user, posts, stats] = await Promise.all([getUser(), getPosts(), getStats()])
```

Now the wait is only as long as the slowest call. Use `Promise.all` when the requests are independent, and sequential `await` when one needs the result of the previous.

## 3. Swallowing errors

```js
async function save(data) {
  try {
    await sendToServer(data)
  } catch (error) {
    console.log('failed')
  }
}
```

This hides the failure from everything that called `save`. The caller thinks it worked. Either let the error travel up, or handle it where you can actually do something useful:

```js
async function save(data) {
  try {
    await sendToServer(data)
    return { ok: true }
  } catch (error) {
    return { ok: false, message: 'We could not save your changes. Try again.' }
  }
}
```

Now the interface can show the person a message instead of failing silently.

## A quick checklist

- Is every promise awaited, returned, or deliberately left running?
- Are independent requests started together?
- Does every failure end up somewhere a person or a log can see it?

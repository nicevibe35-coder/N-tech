---
title: Fetching data the right way
summary: Handle failed requests, bad responses and slow connections instead of hoping they never happen.
minutes: 12
---

`fetch` is the built-in way to ask a server for data. It is easy to use and easy to use badly, so this lesson focuses on what goes wrong.

## The first surprise

`fetch` only rejects when the network itself fails. A response with an error status, like 404 or 500, still counts as a success. You must check it yourself:

```js
async function getJson(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  return response.json()
}
```

The `ok` property is `true` for statuses from 200 to 299.

## Three states for every request

Anything that loads data has three states you must design for: loading, success and failure.

```js
async function loadLessons() {
  let state = { status: 'loading' }
  try {
    const lessons = await getJson('/api/lessons')
    state = { status: 'success', lessons }
  } catch (error) {
    state = { status: 'error', message: 'We could not load the lessons.' }
  }
  return state
}
```

Showing a message and a retry button is far better than a blank page.

## Stop waiting after a while

A request can hang for a long time. `AbortSignal.timeout` gives up after a set time:

```js
const response = await fetch(url, { signal: AbortSignal.timeout(8000) })
```

If the time runs out, the promise rejects and your `catch` runs.

## Cancel outdated requests

When the person changes their mind before a request finishes, such as typing a new search, cancel the old one so a slow response cannot overwrite a newer one:

```js
const controller = new AbortController()
fetch(url, { signal: controller.signal })

// later
controller.abort()
```

## Try it

1. Request a URL that does not exist and confirm that your code reports the failure.
2. Add a timeout of two seconds and test it with a very slow connection in your browser's network panel.

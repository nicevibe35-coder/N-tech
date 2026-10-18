---
title: Promises
summary: Represent a value that will arrive later, and chain steps that depend on it.
minutes: 10
---

A promise is an object that stands for a value you do not have yet. It is always in one of three states: **pending**, **fulfilled** (it worked) or **rejected** (it failed).

## Creating one

```js
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

wait(1000).then(() => console.log('One second later'))
```

`resolve` marks the promise as fulfilled. Calling `reject(error)` marks it as failed.

## Using one

`then` runs when the promise is fulfilled, `catch` runs when it fails, and `finally` runs either way:

```js
fetch('https://example.com/data.json')
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Request failed', error))
  .finally(() => console.log('Done'))
```

Each `then` returns a new promise, which is what makes chaining possible.

## Running several at once

```js
const [a, b] = await Promise.all([fetchA(), fetchB()])
```

`Promise.all` waits for every promise and fails as soon as one fails. Use `Promise.allSettled` when you want every result, even failures.

## A common mistake

Forgetting to return inside `then` breaks the chain:

```js
getUser()
  .then((user) => {
    getPosts(user.id) // missing return: the next step gets undefined
  })
  .then((posts) => console.log(posts)) // undefined
```

Add `return` and the next step receives the posts.

## Try it

1. Write `wait(500)` and chain two `then` calls that log different messages.
2. Make a promise that rejects, and handle it with `catch`.

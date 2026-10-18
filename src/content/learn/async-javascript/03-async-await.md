---
title: async and await
summary: Write asynchronous code that reads from top to bottom.
minutes: 10
---

`async` and `await` are a cleaner way to use promises. They do not replace promises. They let you read the same logic like ordinary steps.

## The basics

Put `async` before a function and you may use `await` inside it. `await` pauses that function until the promise settles, then gives you its value:

```js
async function showUser(id) {
  const response = await fetch(`https://example.com/users/${id}`)
  const user = await response.json()
  return user.name
}
```

An `async` function always returns a promise, even if you return a plain value.

## Handling errors

Use `try` and `catch`, just like synchronous code:

```js
async function loadName(id) {
  try {
    const name = await showUser(id)
    return name
  } catch (error) {
    return 'Unknown'
  }
}
```

If you leave out the `catch`, a rejected promise becomes an error that travels up to whoever called the function.

## Start work together when you can

Awaiting one call after another makes you wait for each in turn:

```js
const a = await loadA()
const b = await loadB() // does not start until loadA finishes
```

If they do not depend on each other, start both first:

```js
const [a, b] = await Promise.all([loadA(), loadB()])
```

## Rules to remember

- `await` only works inside an `async` function (or at the top level of a module).
- Always `await` a promise you care about, or you will get the promise back instead of its value.
- A loop with `await` inside it runs one step at a time.

## Try it

Rewrite the promise chain from the previous lesson using `async` and `await` with `try` and `catch`.

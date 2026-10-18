---
title: Closures in JavaScript, explained with one idea
date: 2026-10-05
summary: A closure is a function that remembers where it was created. That one sentence explains counters, event handlers and half of React's hooks.
tags: javascript, fundamentals
---

Closures have a reputation for being hard. They are not. They come from one idea: **a function remembers the variables that were around when it was created.**

## A counter that keeps its own count

```js
function createCounter() {
  let count = 0

  return function increment() {
    count += 1
    return count
  }
}

const counterA = createCounter()
const counterB = createCounter()

counterA() // 1
counterA() // 2
counterB() // 1
```

When `createCounter` finishes, you might expect `count` to disappear. It does not, because `increment` still uses it. The function carries that variable with it. That carried-along variable is the closure.

Notice that `counterA` and `counterB` each get their own `count`. Every call to `createCounter` creates a fresh set of variables.

## Where you already use closures

Any time a function uses a variable from outside itself, it is a closure:

```js
function setupButton(button, label) {
  button.addEventListener('click', () => {
    console.log(`Clicked: ${label}`)
  })
}
```

The click handler runs long after `setupButton` has returned, yet it still knows `label`.

## The classic trap

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}
// 3, 3, 3
```

With `var`, there is a single `i` shared by every callback, and it is `3` by the time they run. Switch to `let` and each loop pass gets its own `i`:

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}
// 0, 1, 2
```

## A habit worth building

When something behaves strangely, ask: **which variable is this function holding on to, and when did it last change?** That question solves most closure bugs, and it is the same question you will ask later when debugging stale state in React.

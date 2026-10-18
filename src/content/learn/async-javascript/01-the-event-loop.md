---
title: The event loop
summary: Understand how JavaScript does many things with a single thread.
minutes: 8
---

JavaScript runs your code on a single thread, which means it does one thing at a time. Yet pages stay responsive while they wait for network requests and timers. The event loop is why.

## The idea

Slow work, like a timer or a network request, is handed to the browser. When it finishes, its callback waits in a queue. The event loop checks the queue and runs the next callback only when your current code is done.

```js
console.log('first')

setTimeout(() => {
  console.log('third')
}, 0)

console.log('second')
```

This prints `first`, `second`, `third`. Even with a delay of `0`, the callback waits until the current code finishes.

## Why it matters

If your code runs for a long time without stopping, nothing else can happen. The page cannot respond to clicks and animations freeze:

```js
const end = Date.now() + 3000
while (Date.now() < end) {
  // blocks the page for three seconds
}
```

Never write loops like this on the main thread.

## Two queues

There are two queues that matter. Promise callbacks go in the **microtask** queue, and timers go in the **task** queue. After each task, all microtasks run first:

```js
setTimeout(() => console.log('timer'), 0)
Promise.resolve().then(() => console.log('promise'))
console.log('sync')
// sync, promise, timer
```

## Key takeaways

- JavaScript does one thing at a time.
- Slow work is handled outside your code and reported back through queues.
- Long synchronous work blocks everything.

## Try it

Predict the output of the last example before you run it in the console, then check yourself.

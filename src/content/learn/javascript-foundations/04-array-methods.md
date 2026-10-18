---
title: Transforming data with array methods
summary: Replace manual loops with map, filter and reduce.
minutes: 12
---

Instead of writing a loop and a temporary variable every time, arrays come with methods that describe what you want. The three you will use most are `map`, `filter` and `reduce`.

## map: change every item

`map` returns a new array of the same length:

```js
const prices = [10, 20, 30]
const withTax = prices.map((price) => price * 1.1)
// [11, 22, 33]
```

## filter: keep some items

`filter` keeps the items for which your function returns `true`:

```js
const lessons = [
  { title: 'Variables', done: true },
  { title: 'Functions', done: false },
  { title: 'Arrays', done: true },
]

const finished = lessons.filter((lesson) => lesson.done)
// [{ title: 'Variables' ... }, { title: 'Arrays' ... }]
```

## reduce: combine into one value

`reduce` walks through the array carrying a running result:

```js
const total = [10, 20, 30].reduce((sum, price) => sum + price, 0)
// 60
```

The second argument, `0`, is the starting value. Always provide it.

## Chain them

Each method returns something the next one can use:

```js
const titles = lessons
  .filter((lesson) => lesson.done)
  .map((lesson) => lesson.title)
// ['Variables', 'Arrays']
```

## Other methods worth knowing

- `find` returns the first matching item, or `undefined`.
- `some` and `every` answer yes or no questions about the whole array.
- `includes` checks whether a value is in the array.

These methods do not change the original array, which keeps your data predictable.

## Try it

1. Given a list of numbers, use `filter` to keep only the even ones.
2. Use `map` to square the result.
3. Use `reduce` to add them up.

---
title: Arrays and objects
summary: Store lists with arrays and structured data with objects, and read from them safely.
minutes: 10
---

Almost every program works with collections of data. JavaScript gives you two main shapes: arrays for ordered lists and objects for named values.

## Arrays

```js
const languages = ['JavaScript', 'TypeScript', 'Python']

languages[0]       // 'JavaScript'
languages.length   // 3
languages.push('Go')
```

Indexes start at `0`, so the last item is at `length - 1`.

## Objects

```js
const learner = {
  name: 'Ada',
  level: 'beginner',
  streak: 4,
}

learner.name       // 'Ada'
learner['streak']  // 4
learner.streak = 5
```

## Combine them

Real data is usually an array of objects:

```js
const lessons = [
  { title: 'Variables', done: true },
  { title: 'Functions', done: false },
]

lessons[1].title // 'Functions'
```

## Destructuring

Pull values out in one line:

```js
const { name, streak } = learner
const [first, second] = languages
```

## Reading safely

Reading a property of `undefined` throws an error. Use optional chaining to stop early instead:

```js
const city = learner.address?.city // undefined, no error
const label = learner.address?.city ?? 'Unknown'
```

The `??` operator supplies a fallback only when the value is `null` or `undefined`.

## Try it

1. Create an array of three objects that each have `title` and `minutes`.
2. Read the `title` of the second one.
3. Use optional chaining to read a property that does not exist without crashing.

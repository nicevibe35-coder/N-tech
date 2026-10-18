---
title: Variables and types
summary: Declare values with const and let, and learn the primitive types you will use every day.
minutes: 8
---

A variable is a name for a value. Use `const` by default, and `let` only when you need to reassign the name later.

```js
const language = 'JavaScript'
let attempts = 0
attempts = attempts + 1
```

Trying to reassign a `const` throws an error. That is a feature: it tells you right away when something changes that you did not expect.

## The primitive types

JavaScript has seven primitive types: `string`, `number`, `boolean`, `undefined`, `null`, `bigint` and `symbol`. The first five come up constantly.

Use `typeof` to check what you have:

```js
typeof 'hello'   // 'string'
typeof 42        // 'number'
typeof true      // 'boolean'
typeof undefined // 'undefined'
typeof null      // 'object' (a well-known historical quirk)
```

## Strings you can build

Template literals use backticks and let you place values inside a string:

```js
const name = 'Ada'
const message = `Welcome, ${name}!`
```

## Compare with ===

Prefer `===` over `==`. The triple version never converts types behind your back:

```js
0 == '0'   // true  (surprising)
0 === '0'  // false (what you almost always want)
```

## Try it

1. Open your browser's developer tools and find the Console.
2. Declare a `const` with your name and a `let` with a number, then change the number.
3. Predict the result of `typeof` for five different values before you run it.

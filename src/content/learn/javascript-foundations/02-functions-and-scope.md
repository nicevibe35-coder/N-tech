---
title: Functions and scope
summary: Write reusable functions and understand where a variable can be seen.
minutes: 10
---

A function packages a piece of work so you can run it whenever you need. There are two common ways to write one.

```js
function add(a, b) {
  return a + b
}

const multiply = (a, b) => a * b

add(2, 3)      // 5
multiply(2, 3) // 6
```

The second form is an **arrow function**. When the body is a single expression, the `return` is implied.

## Default values

Give a parameter a fallback with `=`:

```js
function greet(name = 'friend') {
  return `Hello, ${name}`
}

greet()      // 'Hello, friend'
greet('Ada') // 'Hello, Ada'
```

## Scope

Scope is the area where a variable can be used. Variables declared with `let` and `const` live inside the nearest pair of braces:

```js
const site = 'DevCircle'

function showTitle() {
  const title = `Welcome to ${site}`
  return title
}

showTitle()
console.log(title) // ReferenceError: title is not defined
```

A function can read variables from outside itself, but the outside cannot read what is inside. Keeping variables in the smallest scope that works makes code easier to reason about.

## Functions are values

You can pass a function to another function. This is the idea behind `map`, event handlers and most of the language:

```js
function twice(action) {
  action()
  action()
}

twice(() => console.log('Hi'))
```

## Try it

1. Write a function `isAdult(age)` that returns `true` when `age` is 18 or more.
2. Rewrite it as an arrow function.
3. Add a default so `isAdult()` with no argument does not crash.

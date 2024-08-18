<p align="center">
  <img height="100" src="TODO" alt="library's logo">
</p>

<h3 align="center">
  groupby-typename
</h3>

<p align="center">
  Type-safe and tested utility to easily group an array of GraphQL objects by their typename
</p>

<p align="center">
  <a href="https://www.npmjs.org/package/groupby-typename">
    <img src="https://badge.fury.io/js/groupby-typename.svg" alt="Current npm package version." />
  </a>
  <a href="https://www.npmjs.org/package/groupby-typename">
    <img src="https://img.shields.io/npm/dm/groupby-typename" alt="Monthly downloads" />
  </a>
  <a href="https://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
  <a href="https://github.com/charpeni/groupby-typename/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="groupby-typename is released under the MIT license." />
  </a>
</p>

<hr />

GraphQL can return a list of objects of different types (nodes or union of types). This utility allows you to group them by their `__typename` field, but also ensure that they are typed accordingly.

By default, using a naive group by doesn't offer a type-safe way to access the grouped objects. Let's say we have an array that contains `User` and `Post`: `Array<User | Post>`, we would expect the returned type to be something like:

```ts
{
  User: User[];
  Post: Post[];
}
```

Unfortunately, it won't be the case, it will either be `Record<string, (User | Post)[]>` or `Record<"User" | "Post", (User | Post)[]>`.

Leading to confusing usages where accessing a key for a given `__typename` won't narrow down the type:

```ts
const grouped = Object.groupBy(data, (item) => item.__typename);
//    ^? Partial<Record<"User" | "Post", (User | Post)[]>>

const users = grouped.User;
//    ^? const users: (User | Post)[] | undefined
```

See this example in [TypeScript Playground](https://www.typescriptlang.org/play/?target=99&ssl=25&ssc=28&pln=25&pc=1#code/C4TwDgpgBAqgzhATlAvFA3gKClA+r0SAOwEMBbCALigHJ4kaAabKASwBNqiBXMgIyQBuFqQrU4wRKyIBzZgF9hmQtAAKAewmoMLfCtFVaGiUxYcuvAYmE5grYABtDEqbIVKAxuqJb2JYCTUAIKIiCQgADz0yAA+UMbAAHzaANos6HgE4BAG1HQIiDRQJHBQXj7AjGycUACMVbm0QQ6sHhBF8sw4GXrZjTQJRSVl3hJV5lAATFV2joY0ABIQDg7qUADq6ogO7B1dGJn65PPRQ6XlY9XUAMwNx3kAQup8e+mHffdGmsBnIxXjNQALDN7E48gAVbIAZQ8UjAwCg4NYYDgrwAup5RgiZIh1NxIOxtAB5PgAKwgHmAADocXiwA8QAAKPwBKqM+wQMgASlQyQ5ZCpvWIxy5wgA9GKcDgAHoAfkwmAu6icVNWMkZtPxEHYooVFwR3AKpTQmoJVOi4slUrlmCAA).

This utility aims to solve this issue by providing a type-safe way to access the grouped objects.

### Installation

```sh
npm install groupby-typename
```

### Usage

> [!NOTE]
> This utility is built with [`Object.groupBy`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy)—which is part of the new baseline for 2024. Currently supported by all major browsers, but requires TypeScript 5.4 and above (you will need to target `ESNext` or the upcoming `ES2024`), or Node 21 and above.
>
> If you do not meet those requirements, don't worry, the utility will fallback to a legacy implementation based on a reducer.

```ts
import { groupByTypename } from 'groupby-typename';

type User = { __typename: 'User'; id: number; name: string };
type Post = { __typename: 'Post'; id: number; title: string };

const data: Array<User | Post> = [
  { __typename: 'User', id: 1, name: 'Alice' },
  { __typename: 'User', id: 2, name: 'Bob' },
  { __typename: 'Post', id: 1, title: 'Hello, world!' },
  { __typename: 'Post', id: 2, title: 'GraphQL is awesome!' },
];

const grouped = groupByTypename(data);
//    ^? const grouped: { User: User[]; Post: Post[]; }

const users = grouped.User;
//    ^? const users: User[]
```

## License

groupby-typename is [MIT licensed](LICENSE).

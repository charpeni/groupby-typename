# groupby-typename

<img height="100" src="https://github.com/user-attachments/assets/c56e1a32-fba3-4fdb-bdc7-ea8743f7298a" alt="library's logo" align="right">

[![Version](https://badge.fury.io/js/groupby-typename.svg)](https://www.npmjs.org/package/groupby-typename)
[![Monthly Downloads](https://img.shields.io/npm/dm/groupby-typename)](https://www.npmjs.org/package/groupby-typename)
[![CodeCov](https://codecov.io/gh/charpeni/groupby-typename/graph/badge.svg?token=2GHFFRN2M7)](https://codecov.io/gh/charpeni/groupby-typename)
[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/charpeni/groupby-typename/blob/main/LICENSE)

Type-safe and tested utility to easily group an array of GraphQL objects by their typename

<br />

## Why

GraphQL can return a list of objects of different types (nodes or union of types). This utility allows you to group them by their `__typename` field, but also ensure that they are typed accordingly.

By default, using a naive group by doesn't offer a type-safe way to access the grouped objects. Let's say we have an array that contains `User` and `Post`: `Array<User | Post>`, we would expect the returned type to be something like:

```ts
{
  User?: User[];
  Post?: Post[];
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

See this example in [TypeScript Playground](https://www.typescriptlang.org/play/?target=11&q=291#code/C4TwDgpgBAqgzhATlAvFA3gKClA+r0SAOwEMBbCALigHJ4kaAabKASwBNqiBXMgIyQBuFqQrU4wRKyIBzZgF9hmQtAAKAewmoMLfCtFVaGiUxYcuvAYmE5grYABtDEqbIVKAxuqJb2JYCTUAIKIiCQgADz0yAA+UMbAAHzaANos6HgE4BAG1HQIiDRQJHBQXj7AjGycUACMVbm0QQ6sHhBF8sw4GXrZjTQJRSVl3hJV5lAATFV2joY0ABIQDg7qUADq6ogO7B1dGJn65PPRQ6XlY9XUAMwNx3kAQup8e+mHffdGmsBnIxXjNQALDN7E48gAVbIAZQ8UjAwCg4NYYDgrwAukoAPSYqAPACiADEAPIAJTxmEwFwRMkQ6m4kHYDwgADMttA0ES+AArCAeYAAOhpdLADxAAAo-AEqmL7BAyABKVDJWVkfm9YjHeXCbE4HAAPQA-BSqVBuAU4EzWYh2VAhfSIIyWWz+dFtTjdYaKTqggTwXiSRTWGQwFsERk7SKQJCNRQoPIoMzaWRaBG+CAALRHCg0Tyjam0+3sILM4BIbQR0XRnLHCX+EhazA6j0Gv5aCMO6gZaIG6jRFIY+LfHuDiT9wRx41503m4ul5BodtFktIF0FN26qCG1sIs1IOC9gr9qBxbhEdgs6QOzBAA).

This utility aims to solve this issue by providing a type-safe way to access the grouped objects.

## Installation

```sh
npm install groupby-typename
```

## Usage

> [!NOTE]
> This utility is built with [`Object.groupBy`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy)—which is part of the new baseline for 2024. Currently supported by all major browsers, but requires TypeScript 5.4 and above (you will need to target at least `ES2024`), or Node 21 and above.
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
//    ^? const grouped: { User?: User[]; Post?: Post[]; }

const users = grouped.User;
//    ^? const users: User[] | undefined
```

> [!NOTE]
> Because they are not runtime types, the union of types is necessarily a superset of the types in the array at runtime. Therefore, the returned keys are always optional, as we can't know if at least one object of a given type is present in the array.

## License

groupby-typename is [MIT licensed](LICENSE).

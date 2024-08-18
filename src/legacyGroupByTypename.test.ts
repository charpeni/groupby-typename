import { expectTypeOf } from 'expect-type';

import { legacyGroupByTypename } from './legacyGroupByTypename';

describe('legacyGroupByTypename', () => {
  it('should group objects by __typename', () => {
    const objects = [
      { __typename: 'User', id: 1, name: 'John' },
      { __typename: 'User', id: 2, name: 'Jane' },
      { __typename: 'Post', id: 1, title: 'Hello World' },
      { __typename: 'Post', id: 2, title: 'Goodbye World' },
    ];

    const result = legacyGroupByTypename(objects);

    expect(result).toEqual({
      User: [
        { __typename: 'User', id: 1, name: 'John' },
        { __typename: 'User', id: 2, name: 'Jane' },
      ],
      Post: [
        { __typename: 'Post', id: 1, title: 'Hello World' },
        { __typename: 'Post', id: 2, title: 'Goodbye World' },
      ],
    });
  });

  it('should handle empty array', () => {
    const objects: Array<never> = [];

    const result = legacyGroupByTypename(objects);

    expect(result).toEqual({});
  });

  it('should handle single object', () => {
    const objects = [{ __typename: 'User', id: 1, name: 'John' }];

    const result = legacyGroupByTypename(objects);

    expect(result).toEqual({
      User: [{ __typename: 'User', id: 1, name: 'John' }],
    });
  });

  it('should type the return object with proper keys based on __typename', () => {
    type User = {
      __typename: 'User';
      id: number;
      name: string;
    };
    type Post = {
      __typename: 'Post';
      id: number;
      title: string;
    };
    type Objects = Array<User | Post>;

    const objects: Objects = [
      { __typename: 'User', id: 1, name: 'John' },
      { __typename: 'User', id: 2, name: 'Jane' },
      { __typename: 'Post', id: 1, title: 'Hello World' },
      { __typename: 'Post', id: 2, title: 'Goodbye World' },
    ];

    const result = legacyGroupByTypename(objects);

    expectTypeOf(result).toEqualTypeOf<{
      User?: Array<User>;
      Post?: Array<Post>;
    }>();

    expectTypeOf(result.User).toEqualTypeOf<Array<User> | undefined>();
    expectTypeOf(result.Post).toEqualTypeOf<Array<Post> | undefined>();
  });

  it('should handle potential keys', () => {
    type User = {
      __typename: 'User';
      id: number;
      name: string;
    };
    type Post = {
      __typename: 'Post';
      id: number;
      title: string;
    };
    type Objects = Array<User | Post>;

    const objects: Objects = [
      { __typename: 'User', id: 1, name: 'John' },
      { __typename: 'User', id: 2, name: 'Jane' },
    ];

    const result = legacyGroupByTypename(objects);

    expectTypeOf(result).toEqualTypeOf<{
      User?: Array<User>;
      Post?: Array<Post>;
    }>();

    expectTypeOf(result.User).toEqualTypeOf<Array<User> | undefined>();
    expectTypeOf(result.Post).toEqualTypeOf<Array<Post> | undefined>();
  });
});

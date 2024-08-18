import { expectTypeOf } from 'expect-type';

import { groupByTypename } from './groupByTypename';
import * as legacyGroupByTypenameModule from './legacyGroupByTypename';

const [nodeMajor] = process.versions.node.split('.').map(Number);
const isNode21OrLater = nodeMajor && nodeMajor >= 21;

describe('groupByTypename', () => {
  let legacyImplementationSpy: jest.SpyInstance;

  beforeEach(() => {
    legacyImplementationSpy = jest.spyOn(
      legacyGroupByTypenameModule,
      'legacyGroupByTypename',
    );

    // `Object.groupBy` is supported by Node.js 21 and later.
    // Let's make sure we mock the legacy implementation for newer versions.
    // The rationale is that we want to make sure to always test the non-legacy
    // implementation when it's available.
    if (isNode21OrLater) {
      legacyImplementationSpy.mockImplementation(() => {
        throw new Error(
          'legacyGroupByTypename should not be called in this environment',
        );
      });
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // This is expected to be executed in a tests matrix
  // including at least a version without and with support.
  if (isNode21OrLater) {
    describe('Node 21 or later', () => {
      let originalGroupBy: typeof Object.groupBy;

      beforeAll(() => {
        originalGroupBy = Object.groupBy;
      });

      afterEach(() => {
        if (originalGroupBy) {
          Object.groupBy = originalGroupBy;
        }
        jest.clearAllMocks();
      });

      it('should use the non-legacy implementation when available', () => {
        groupByTypename([]);

        expect(legacyImplementationSpy).not.toHaveBeenCalled();
      });

      it('should use the legacy implementation when `Object.groupBy` is not available', () => {
        // @ts-expect-error -- Simulate `Object` without `groupBy`
        delete Object.groupBy;

        expect(() => {
          groupByTypename([]);
        }).toThrow(
          'legacyGroupByTypename should not be called in this environment',
        );

        expect(legacyImplementationSpy).toHaveBeenCalled();
      });
    });
  } else {
    describe('Node 20 or earlier', () => {
      it('should use the legacy implementation when `Object.groupBy` is not available', () => {
        groupByTypename([]);

        expect(legacyImplementationSpy).toHaveBeenCalled();
      });
    });
  }

  it('should group objects by __typename', () => {
    const objects = [
      { __typename: 'User', id: 1, name: 'John' },
      { __typename: 'User', id: 2, name: 'Jane' },
      { __typename: 'Post', id: 1, title: 'Hello World' },
      { __typename: 'Post', id: 2, title: 'Goodbye World' },
    ];

    const result = groupByTypename(objects);

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

    const result = groupByTypename(objects);

    expect(result).toEqual({});
  });

  it('should handle single object', () => {
    const objects = [{ __typename: 'User', id: 1, name: 'John' }];

    const result = groupByTypename(objects);

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

    const result = groupByTypename(objects);

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

    const result = groupByTypename(objects);

    expectTypeOf(result).toEqualTypeOf<{
      User?: Array<User>;
      Post?: Array<Post>;
    }>();

    expectTypeOf(result.User).toEqualTypeOf<Array<User> | undefined>();
    expectTypeOf(result.Post).toEqualTypeOf<Array<Post> | undefined>();
  });
});

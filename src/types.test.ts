import { expectTypeOf } from 'expect-type';

import type { GraphQLObject, GroupedGraphQLObjects } from './types';

describe('types', () => {
  describe('GraphQLObject', () => {
    it('should accept an object with __typename property', () => {
      expectTypeOf<{
        __typename: 'User';
      }>().toMatchTypeOf<GraphQLObject>();
    });

    it('should accept an object with additional properties', () => {
      expectTypeOf<{
        __typename: 'User';
        name: string;
      }>().toMatchTypeOf<GraphQLObject>();
    });

    it('should not accept an object without __typename property', () => {
      expectTypeOf<{
        name: string;
      }>().not.toMatchTypeOf<GraphQLObject>();
    });
  });

  describe('GroupedGraphQLObjects', () => {
    it('should group objects by __typename', () => {
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

      expectTypeOf<{
        User: Array<User>;
        Post: Array<Post>;
      }>().toMatchTypeOf<GroupedGraphQLObjects<Objects>>();
    });
  });
});

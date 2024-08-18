import { legacyGroupByTypename } from './legacyGroupByTypename';
import type { GraphQLObject, GroupedGraphQLObjects } from './types';

/**
 * Groups an array of GraphQL objects by their `__typename` property.
 *
 * Useful when getting nodes or a union of types from a GraphQL response.
 *
 * @example
 * ```ts
 * const data = [{ __typename: 'User' as const }, { __typename: 'Post' as const }];
 * const grouped = groupByTypename(data);
 * //    ^? const grouped: {
 * //         User: {
 * //           __typename: "User";
 * //         }[];
 * //         Post: {
 * //           __typename: "Post";
 * //         }[];
 * //       }
 * const users = grouped.User;
 * //    ^? const users: {
 * //         __typename: "User";
 * //       }[]
 * ```
 */
export function groupByTypename<
  Objects extends readonly GraphQLObject[],
  Grouped = GroupedGraphQLObjects<Objects>,
>(objects: Objects): Grouped {
  // Not all environments support `Object.groupBy` yet.
  if (!('groupBy' in Object)) {
    return legacyGroupByTypename(objects) as Grouped;
  }

  return Object.groupBy(objects, (object) => object.__typename) as Grouped;
}

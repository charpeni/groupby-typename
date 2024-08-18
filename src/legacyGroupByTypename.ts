import type { GraphQLObject, GroupedGraphQLObjects } from './types';

/**
 * Replaces `Object.groupBy` with a legacy implementation for environments that don't support it.
 *
 * This is part of the new baseline for 2024 and currently implemented by all major browsers.
 * TypeScript support requires 5.4 or later, and should target `ESNext` or upcoming `ES2024`.
 * Node support requires Node 21 or later.
 */
export function legacyGroupByTypename<Objects extends readonly GraphQLObject[]>(
  objects: Objects,
): GroupedGraphQLObjects<Objects> {
  return objects.reduce((acc, object) => {
    const key = object.__typename as keyof GroupedGraphQLObjects<Objects>;

    if (!acc[key]) {
      acc[key] = [] as GroupedGraphQLObjects<Objects>[typeof key];
    }

    acc[key]!.push(
      object as Exclude<
        GroupedGraphQLObjects<Objects>[typeof key],
        undefined
      >[number],
    );

    return acc;
  }, {} as GroupedGraphQLObjects<Objects>);
}

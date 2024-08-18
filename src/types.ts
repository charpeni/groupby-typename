/**
 * Represents a GraphQL object with minimally a `__typename` property.
 */
export type GraphQLObject = { __typename: string; [key: PropertyKey]: unknown };

/**
 * Defines a type representing a grouping of GraphQL objects based on their `__typename` property.
 *
 * Basically a type representing of a group by operation on an array of GraphQL objects.
 */
export type GroupedGraphQLObjects<Objects extends readonly GraphQLObject[]> = {
  [K in Objects[number]['__typename']]: Extract<
    Objects[number],
    { __typename: K }
  >[];
} & {};

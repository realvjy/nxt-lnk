/**
 * Utility types for TypeScript
 */

/**
 * Makes specified properties of T optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Makes specified properties of T required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Makes all properties of T nullable
 */
export type Nullable<T> = { [P in keyof T]: T[P] | null };

/**
 * Makes all properties of T non-nullable
 */
export type NonNullable<T> = { [P in keyof T]: Exclude<T[P], null | undefined> };

/**
 * Extracts the type of an array element
 */
export type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/**
 * Creates a type with only the specified keys of T
 */
export type PickOnly<T, K extends keyof T> = Pick<T, K> & { [P in Exclude<keyof T, K>]?: never };

/**
 * Converts a union type to an intersection type
 */
export type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

/**
 * Extracts the discriminated union member with the specified discriminant
 */
export type ExtractMember<T, D extends string, V extends string> =
    T extends { [K in D]: V } ? T : never;

/**
 * Creates a type with all properties of T set to the specified ValueType
 */
export type RecordOf<T extends keyof any, ValueType> = Record<T, ValueType>;

/**
 * Converts all properties of T to camelCase
 */
export type CamelCase<T> = {
    [K in keyof T as CamelCaseString<string & K>]: T[K]
};

/**
 * Helper type for converting a string to camelCase
 */
type CamelCaseString<S extends string> =
    S extends `${infer F}_${infer R}` ? `${F}${Capitalize<CamelCaseString<R>>}` : S;

/**
 * Converts all properties of T to snake_case
 */
export type SnakeCase<T> = {
    [K in keyof T as SnakeCaseString<string & K>]: T[K]
};

/**
 * Helper type for converting a string to snake_case
 */
type SnakeCaseString<S extends string> =
    S extends `${infer F}${infer R}` ?
    F extends Uppercase<F> ?
    R extends "" ? Lowercase<F> : `${Lowercase<F>}_${SnakeCaseString<R>}`
    : `${F}${SnakeCaseString<R>}`
    : S;

/**
 * Converts a type to a readonly version
 */
export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

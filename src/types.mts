import type { Ribbit } from './Ribbit.mjs'
import type { RibbitObject } from './RibbitObject.mjs'

/**
 * Constructor represents a constructor type that takes a Ribbit instance.
 */
export type Constructor<Base> = new (ribbit: Ribbit, ...args: any[]) => Base

/**
 * ConstructorArgs infers the arguments of a Ribbit constructor.
 */
export type ConstructorArgs<
  Base extends RibbitObject,
  T extends Constructor<Base> = Constructor<Base>,
  A extends unknown[] = []
> = T extends new (ribbit: Ribbit, ...args: [...A, ...infer B]) => RibbitObject ? B : never

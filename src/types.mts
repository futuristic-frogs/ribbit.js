import { Ribbit } from './Ribbit.mjs'
import { RibbitObject } from './RibbitObject.mjs'

/**
 * ConstructorType represents a constructor type that takes a Ribbit instance.
 */
export type ConstructorType<Base> = new (ribbit: Ribbit, ...args: any[]) => Base

/**
 * Constructor infers the arguments and return type of a Ribbit constructor.
 */
export type Constructor<
  Base extends RibbitObject,
  T extends ConstructorType<Base> = ConstructorType<Base>,
  A extends unknown[] = []
> = T extends new (ribbit: Ribbit, ...args: [...A, ...infer B]) => infer C
  ? {
      args: B
      type: C
    }
  : never

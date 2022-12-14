import { Vec2d } from '../Vec2d.mjs'

interface Vec {
  /**
   * Create a new Vec2d. If only one argument is given, it will be used for both
   * x and y.
   */
  (x: number, y?: number): Vec2d
  /**
   * The zero vector.
   */
  readonly zero: Vec2d
  /**
   * The unit vector (1, 1).
   */
  readonly one: Vec2d
  /**
   * Create a new vector with the given x value and 0 for y.
   */
  x(x: number): Vec2d
  /**
   * Create a new vector with the given y value and 0 for x.
   */
  y(y: number): Vec2d
  /**
   * Create a new vector with random x and y values between 0 and 1.
   */
  random(scalar?: number): Vec2d
}

const macro = (x: number, y = x): Vec2d => new Vec2d(x, y)
macro.zero = new Vec2d(0, 0)
macro.one = new Vec2d(1, 1)
macro.x = (x: number): Vec2d => new Vec2d(x, 0)
macro.y = (y: number): Vec2d => new Vec2d(0, y)
macro.random = (scalar = 1): Vec2d => new Vec2d(Math.random(), Math.random()).scale(scalar)

/**
 * A macro for creating vectors.
 */
export const vec: Vec = macro

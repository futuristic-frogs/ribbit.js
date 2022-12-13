/**
 * A Vec2d represents a 2D vector. Vectors are immutable; all methods return a
 * new vector instead of modifying the existing one.
 */
export class Vec2d {
  /**
   * Create a new Vec2d.
   */
  constructor(public readonly x: number, public readonly y: number) {}

  /**
   * The zero vector.
   */
  static readonly ZERO = new Vec2d(0, 0)

  /**
   * The unit vector (1, 1).
   */
  static readonly ONE = new Vec2d(1, 1)

  /**
   * Check if this vector is equal to another.
   */
  equals(other: Vec2d): boolean {
    return this.x === other.x && this.y === other.y
  }

  toString(): string {
    const x = Math.floor(this.x * 100) / 100
    const y = Math.floor(this.y * 100) / 100
    return `(${x}, ${y})`
  }

  /**
   * Create a new vector, with the given x and y values (or the existing ones if
   * not given).
   */
  with({ x, y }: { x?: number; y?: number }): Vec2d {
    return new Vec2d(x ?? this.x, y ?? this.y)
  }

  add(x?: number, y?: number): Vec2d
  add(other: Vec2d): Vec2d
  add(xOrOther: number | Vec2d = 0, y = 0): Vec2d {
    if (typeof xOrOther === 'number') {
      return new Vec2d(this.x + xOrOther, this.y + y)
    } else {
      return new Vec2d(this.x + xOrOther.x, this.y + xOrOther.y)
    }
  }

  sub(x?: number, y?: number): Vec2d
  sub(other: Vec2d): Vec2d
  sub(xOrOther: number | Vec2d = 0, y = 0): Vec2d {
    if (typeof xOrOther === 'number') {
      return new Vec2d(this.x - xOrOther, this.y - y)
    } else {
      return new Vec2d(this.x - xOrOther.x, this.y - xOrOther.y)
    }
  }

  mul(x?: number, y?: number): Vec2d
  mul(other: Vec2d): Vec2d
  mul(xOrOther: number | Vec2d = 1, y = 1): Vec2d {
    if (typeof xOrOther === 'number') {
      return new Vec2d(this.x * xOrOther, this.y * y)
    } else {
      return new Vec2d(this.x * xOrOther.x, this.y * xOrOther.y)
    }
  }

  div(x?: number, y?: number): Vec2d
  div(other: Vec2d): Vec2d
  div(xOrOther: number | Vec2d = 1, y = 1): Vec2d {
    if (typeof xOrOther === 'number') {
      return new Vec2d(this.x / xOrOther, this.y / y)
    } else {
      return new Vec2d(this.x / xOrOther.x, this.y / xOrOther.y)
    }
  }

  /**
   * Calculate the dot product of this vector and another.
   */
  dot(other: Vec2d): number {
    return this.x * other.x + this.y * other.y
  }

  /**
   * Scale this vector by a scalar.
   * @param scalar The scalar to scale by.
   */
  scale(scalar: number): Vec2d {
    return new Vec2d(this.x * scalar, this.y * scalar)
  }

  /**
   * Normalize this vector (scale it to length 1).
   */
  normalize(): Vec2d {
    return this.scale(1 / this.length())
  }

  /**
   * The length of this vector.
   */
  length(): number {
    return Math.sqrt(this.dot(this))
  }
}

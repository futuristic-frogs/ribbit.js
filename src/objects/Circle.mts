import { CircleRenderer } from '../components/CircleRenderer.mjs'
import { GameObject } from '../GameObject.mjs'
import { Ribbit } from '../Ribbit.mjs'
import { Vec2d } from '../Vec2d.mjs'

/**
 * A circular game object, containing a radius and a single {@link components!CircleRenderer} component.
 */
export class Circle extends GameObject {
  constructor(ribbit: Ribbit, pos: Vec2d, public readonly radius: number) {
    super(ribbit, pos)

    this.add(CircleRenderer, radius)
  }
}

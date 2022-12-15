import { CircleRenderer } from '../components/CircleRenderer.mjs'
import { GameObject } from '../GameObject.mjs'
import type { Ribbit } from '../Ribbit.mjs'
import type { Scene } from '../Scene.mjs'
import type { Vec2d } from '../Vec2d.mjs'

/**
 * A circular game object, containing a radius and a single {@link components!CircleRenderer} component.
 */
export class Circle extends GameObject {
  constructor(ribbit: Ribbit, scene: Scene, pos: Vec2d, public readonly radius: number) {
    super(ribbit, scene, pos)

    this.add(CircleRenderer, radius)
  }
}

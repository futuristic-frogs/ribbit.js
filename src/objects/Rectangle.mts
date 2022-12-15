import { RectangleRenderer } from '../components/RectangleRenderer.mjs'
import { GameObject } from '../GameObject.mjs'
import type { Ribbit } from '../Ribbit.mjs'
import type { Scene } from '../Scene.mjs'
import type { Vec2d } from '../Vec2d.mjs'

/**
 * A rectangular game object, containing a width and height and a single {@link components!RectangleRenderer} component.
 */
export class Rectangle extends GameObject {
  constructor(
    ribbit: Ribbit,
    scene: Scene,
    pos: Vec2d,
    public readonly width: number,
    public readonly height: number
  ) {
    super(ribbit, scene, pos)

    this.add(RectangleRenderer, width, height)
  }
}

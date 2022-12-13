import { Component } from '../Component.mjs'
import { GameObject } from '../GameObject.mjs'
import { Ribbit } from '../Ribbit.mjs'

/**
 * A component that renders a rectangle. The object's position is the top left
 * corner of the rectangle.
 */
export class RectangleRenderer extends Component {
  constructor(
    ribbit: Ribbit,
    object: GameObject,
    public readonly width: number,
    public readonly height: number
  ) {
    super(ribbit, object)
  }

  render(): void {
    const { ctx } = this.ribbit.layer()
    const { x, y } = this.object.pos
    ctx.beginPath()
    ctx.rect(x, y, this.width, this.height)
    ctx.clip()
  }
}

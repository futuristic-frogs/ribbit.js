import { Component } from '../Component.mjs'
import { GameObject } from '../GameObject.mjs'
import { Ribbit } from '../Ribbit.mjs'

/**
 * A component that renders a circle. The circle is centered on the object's
 * position.
 */
export class CircleRenderer extends Component {
  constructor(ribbit: Ribbit, object: GameObject, public readonly radius: number) {
    super(ribbit, object)
  }

  render(): void {
    const { ctx } = this.ribbit.layer()
    const { x, y } = this.object.pos
    ctx.beginPath()
    ctx.arc(x + this.radius, y + this.radius, this.radius, 0, 2 * Math.PI)
    ctx.clip()
  }
}

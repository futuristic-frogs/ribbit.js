import { Component } from '../Component.mjs'
import { GameObject } from '../GameObject.mjs'
import { Ribbit } from '../Ribbit.mjs'

/**
 * A component that scales the object's rendering. The object's position is the
 * center of the scaled object.
 */
export class Scale extends Component {
  constructor(ribbit: Ribbit, object: GameObject, public scaleX = 1, public scaleY = scaleX) {
    super(ribbit, object)
  }

  setScale(scale: number): void {
    this.scaleX = this.scaleY = scale
  }

  beforeRender(): void {
    const { ctx } = this.ribbit.layer()
    ctx.scale(this.scaleX, this.scaleY)
  }
}

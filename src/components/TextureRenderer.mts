import { Component } from '../Component.mjs'
import type { GameObject } from '../GameObject.mjs'
import type { Ribbit } from '../Ribbit.mjs'
import type { Texture } from '../Texture.mjs'

/**
 * A component that renders a texture. The object's position is the top left
 * corner of the texture.
 */
export class TextureRenderer extends Component {
  constructor(ribbit: Ribbit, object: GameObject, public readonly texture: Texture) {
    super(ribbit, object)
  }

  beforeRender(): void {
    const { ctx } = this.ribbit.layer()
    if (this.texture.color) {
      ctx.fillStyle = this.texture.color
    }
  }

  afterRender(): void {
    const { ctx } = this.ribbit.layer()
    if (this.texture.image) {
      const { x, y } = this.object.pos
      const width = this.texture.image.width * this.texture.scale
      const height = this.texture.image.height * this.texture.scale
      ctx.drawImage(this.texture.image, x, y, width, height)
    } else if (this.texture.color) {
      const { x, y } = this.object.pos
      ctx.fillRect(x - 5_000, y - 5_000, 10_000, 10_000)
    }
  }

  details(): Record<string, any> {
    return { texture: this.texture }
  }
}

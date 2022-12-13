import { Ribbit } from './Ribbit.mjs'
import { RibbitObject } from './RibbitObject.mjs'

/**
 * A texture is an image or CSS color that can be applied to a game object.
 */
export class Texture extends RibbitObject {
  /**
   * The color of this texture, if any.
   */
  readonly color?: string
  /**
   * The image of this texture, if any.
   */
  readonly image?: HTMLImageElement

  /**
   * Create a new texture from a CSS color string.
   */
  constructor(ribbit: Ribbit, color: string)
  /**
   * Create a new texture from an image.
   * @param image The image to use for this texture.
   * @param scale The scale of the image (default: 1).
   */
  constructor(ribbit: Ribbit, image: HTMLImageElement, scale?: number)
  constructor(ribbit: Ribbit, imageOrColor: string | HTMLImageElement, public readonly scale = 1) {
    super(ribbit, 't')

    if (typeof imageOrColor === 'string') {
      this.color = imageOrColor
    } else {
      this.image = imageOrColor
    }
  }

  details(): Record<string, any> {
    if (this.color) {
      return { color: this.color }
    } else if (this.image) {
      return { image: this.image.src, scale: this.scale }
    } else {
      return {}
    }
  }
}

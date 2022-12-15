import type { Ribbit } from './Ribbit.mjs'
import { RibbitObject } from './RibbitObject.mjs'

/**
 * Layers are used to draw to the canvas in a specific order. Each layer has its own offscreen canvas, which is
 * drawn to the main canvas in the order of the layer's z-index.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
 */
export class Layer extends RibbitObject {
  readonly canvas: OffscreenCanvas
  readonly ctx: OffscreenCanvasRenderingContext2D

  constructor(ribbit: Ribbit, public readonly name: string, public readonly z: number) {
    super(ribbit, { namespace: 'l', id: name })
    this.canvas = new OffscreenCanvas(ribbit.canvas.width, ribbit.canvas.height)
    this.ctx = this.canvas.getContext('2d')! as OffscreenCanvasRenderingContext2D
  }
}

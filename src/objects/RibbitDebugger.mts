import { GameObject } from '../GameObject.mjs'
import { Ribbit } from '../Ribbit.mjs'
import type { Scene } from '../Scene.mjs'
import { Vec2d } from '../Vec2d.mjs'

/**
 * The Ribbit debugger is a special object that renders debug information to the
 * screen. It should not be added to a scene manually; instead, the engine will
 * keep track of it automatically and render it when appropriate.
 * @internal
 */
export class RibbitDebugger extends GameObject {
  constructor(ribbit: Ribbit, scene: Scene) {
    super(ribbit, scene, Vec2d.ZERO)
  }

  #fps = 0
  #avgFps = 0
  #dtHistory: number[] = []

  render(): void {
    const { canvas, activeScene } = this.ribbit
    const { ctx: c } = this.ribbit.layer('debug')
    c.save()
    c.strokeStyle = 'green'
    c.fillStyle = 'green'
    c.lineWidth = 4
    c.font = '24px JetBrains Mono'
    // draw border
    c.beginPath()
    c.rect(0, 0, canvas.width, canvas.height)
    c.stroke()

    const objects = activeScene?.objects.values()
    const components = objects?.flatMap((o) => o.components.values())

    const lines = [
      `Ribbit v${Ribbit.version}`,
      `${canvas.width}x${canvas.height}`,
      `Active Scene: ${activeScene}`,
      `${objects?.length} objects, ${components?.length} components`,
    ]
    for (let i = 0; i < lines.length; i++) {
      c.fillText(lines[i], 10, 30 + 30 * i)
    }

    c.fillStyle = '#ffffffaa'

    const text = `${this.#fps.toString().padStart(3)} FPS`
    const { width } = c.measureText(text)

    c.fillRect(0, canvas.height - 60, width + 10, 60)

    c.fillStyle = 'green'

    c.fillText(`${this.#avgFps} FPS`, 4, canvas.height - 34)
    c.fillText(`${this.#fps} FPS`, 4, canvas.height - 6)

    // draw fps graph
    // shorter bars = higher fps
    const barWidth = 4
    const bars = this.#dtHistory.map((dt) => Math.max(5, dt * 2))

    for (let i = 0; i < bars.length; i++) {
      if (1000 / this.#dtHistory[i] >= 60) {
        c.fillStyle = 'green'
      } else if (1000 / this.#dtHistory[i] >= 30) {
        c.fillStyle = 'yellow'
      } else {
        c.fillStyle = 'red'
      }

      c.fillRect(width + 10 + i * barWidth, canvas.height - bars[i], barWidth, bars[i])
    }
    c.restore()
  }

  #avgFpsUpdateMs = 1000
  update(dt: number): void {
    this.#fps = Math.round(1000 / dt)
    this.#dtHistory.push(dt)
    if (this.#dtHistory.length > 150) {
      this.#dtHistory.shift()
    }

    const last50 = this.#dtHistory.slice(this.#dtHistory.length - 50)

    this.#avgFpsUpdateMs -= dt
    if (this.#avgFpsUpdateMs <= 0) {
      this.#avgFps = Math.round(1000 / (last50.reduce((a, b) => a + b, 0) / last50.length))
      this.#avgFpsUpdateMs = 1000
    }
  }
}

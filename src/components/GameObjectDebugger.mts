import { Component } from '../Component.mjs'

/**
 * A component that renders a debug overlay for a game object. This component
 * renders the object's position, size (if applicable), and all of its
 * components' names and values.
 *
 * This component is not intended to be used directly. GameObjects will
 * automatically manage this component when the `debug` Ribbit option is enabled.
 * @internal
 */
export class GameObjectDebugger extends Component {
  beforeRender(): void {
    const { ctx } = this.ribbit.layer('debug')

    const { pos, components } = this.object
    ctx.strokeStyle = 'green'
    ctx.fillStyle = 'green'
    ctx.lineWidth = 2
    ctx.font = '18px JetBrains Mono'

    const componentLines = components
      .filter((c) => !(c instanceof GameObjectDebugger))
      .map((c) => c.toString())

    const lines = [`${this.object.toString()}`, ...componentLines]
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[lines.length - 1 - i], pos.x, pos.y - 24 * i - 18)
    }
  }

  render(): void {
    const { ctx } = this.ribbit.layer('debug')
    const { pos } = this.object
    if ('width' in this.object && 'height' in this.object) {
      ctx.strokeRect(pos.x, pos.y, this.object.width as number, this.object.height as number)
    }
  }
}

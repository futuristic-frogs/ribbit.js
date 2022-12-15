import { Component } from '../Component.mjs'
import type { GameObject } from '../GameObject.mjs'
import type { Ribbit } from '../Ribbit.mjs'

export class KeyboardListener extends Component {
  readonly listenerId: string

  constructor(ribbit: Ribbit, object: GameObject) {
    super(ribbit, object)
    this.listenerId = ribbit.keyboard.addListener('_any', this.#onEvent.bind(this))
    this.log?.(this.listenerId)
  }

  #onEvent(event: KeyboardEvent) {
    switch (event.type) {
      case 'keydown':
        return this.onKeyDown(event)
      case 'keyup':
        return this.onKeyUp(event)
      case 'keypress':
        return this.onKeyPress(event)
    }
  }

  onKeyDown(event: KeyboardEvent): void {}

  onKeyUp(event: KeyboardEvent): void {}

  onKeyPress(event: KeyboardEvent): void {}
}

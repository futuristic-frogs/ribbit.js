import { Collection } from './Collection.mjs'
import type { Ribbit } from './Ribbit.mjs'
import { RibbitObject } from './RibbitObject.mjs'

export interface KeyboardHandler {
  id: string
  fn: (event: KeyboardEvent) => void
}

export type KeyboardEventName = 'keydown' | 'keyup' | 'keypress' | '_any'

export class Keyboard extends RibbitObject {
  readonly listeners: Record<KeyboardEventName, Collection<KeyboardHandler>> = {
    keydown: new Collection(),
    keyup: new Collection(),
    keypress: new Collection(),
    _any: new Collection(),
  }

  keys: Record<string, boolean> = {}

  constructor(ribbit: Ribbit) {
    super(ribbit, 'k')
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
    window.addEventListener('keypress', this.onKeyPress.bind(this))
  }

  addListener(event: KeyboardEventName, fn: (event: KeyboardEvent) => void): string {
    const id = this.ribbit.id('kl')
    this.listeners[event].add({ id, fn })
    return id
  }

  removeListener(id: string): void
  removeListener(event: string, id: string): void
  removeListener(eventOrId: string, id?: string): void {
    if (id) {
      this.listeners[eventOrId as KeyboardEventName]?.remove(id)
    } else {
      for (const collection of Object.values(this.listeners)) {
        collection.remove(eventOrId)
      }
    }
  }

  onKeyDown(event: KeyboardEvent) {
    event.preventDefault()
    this.keys[event.key] = true
    for (const listener of [...this.listeners.keydown, ...this.listeners._any]) {
      listener.fn(event)
    }
  }

  onKeyUp(event: KeyboardEvent) {
    event.preventDefault()
    this.keys[event.key] = false
    for (const listener of [...this.listeners.keyup, ...this.listeners._any]) {
      listener.fn(event)
    }
  }

  onKeyPress(event: KeyboardEvent) {
    event.preventDefault()
    this.keys[event.key] = false
    for (const listener of [...this.listeners.keypress, ...this.listeners._any]) {
      listener.fn(event)
    }
  }

  isDown(key: string) {
    return !!this.keys[key]
  }

  isUp(key: string) {
    return !this.keys[key]
  }
}

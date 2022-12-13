import { Collection } from './Collection.mjs'
import { GameObject } from './GameObject.mjs'
import { Ribbit } from './Ribbit.mjs'
import { RibbitObject } from './RibbitObject.mjs'

/**
 * A component is a reusable piece of functionality that can be added to a {@link GameObject}.
 */
export abstract class Component extends RibbitObject {
  constructor(ribbit: Ribbit, public readonly object: GameObject) {
    super(ribbit, 'c')
  }

  beforeRender(): void {}
  render(): void {}
  afterRender(): void {}
  beforeUpdate(dt: number): void {}
  update(dt: number): void {}
  afterUpdate(dt: number): void {}
}

/**
 * A {@link Collection} of {@link Component}s with custom methods for calling
 * the lifecycle methods of each component.
 */
export class ComponentCollection extends Collection<Component> {
  beforeRender(): void {
    for (const component of this) {
      component.beforeRender()
    }
  }

  render(): void {
    for (const component of this) {
      component.render()
    }
  }

  afterRender(): void {
    for (const component of this) {
      component.afterRender()
    }
  }

  beforeUpdate(dt: number): void {
    for (const component of this) {
      component.beforeUpdate(dt)
    }
  }

  update(dt: number): void {
    for (const component of this) {
      component.update(dt)
    }
  }

  afterUpdate(dt: number): void {
    for (const component of this) {
      component.afterUpdate(dt)
    }
  }
}

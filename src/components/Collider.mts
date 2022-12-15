import { Collection } from '../Collection.mjs'
import { Component } from '../Component.mjs'
import { RibbitObject } from '../RibbitObject.mjs'
import type { Scene } from '../Scene.mjs'

export class CollisionLayer extends RibbitObject {
  readonly colliders = new Collection<Collider>()

  constructor(scene: Scene, public readonly name: string) {
    super(scene.ribbit, { namespace: 'cl', id: name })
  }
}

export class Collider extends Component {
  static readonly layers = new WeakMap<Scene, Collection<CollisionLayer>>()
}

import { Collection } from './Collection.mjs'
import { GameObject } from './GameObject.mjs'
import { Ribbit } from './Ribbit.mjs'
import { RibbitObject } from './RibbitObject.mjs'
import { Constructor, ConstructorType } from './types.mjs'

/**
 * A scene is a collection of game objects. It is the main unit of organization
 * in a Ribbit game. A scene can be thought of as a "level" or a "screen"
 * in a game.
 */
export class Scene extends RibbitObject {
  /**
   * The collection of game objects in this scene.
   */
  readonly objects = new Collection<GameObject>()

  /**
   * Create a new scene.
   */
  constructor(ribbit: Ribbit) {
    super(ribbit, 's')
  }

  /**
   * Add an existing game object to this scene.
   */
  add(object: GameObject): GameObject
  /**
   * Create and add a game object to this scene.
   * @param ObjectClass The class of the game object to create.
   * @param args The arguments to pass to the game object constructor.
   */
  add<
    T extends ConstructorType<GameObject>,
    U extends Constructor<GameObject, T> = Constructor<GameObject, T>
  >(ObjectClass: T, ...args: U['args']): U['type']

  add<
    T extends ConstructorType<GameObject>,
    U extends Constructor<GameObject, T> = Constructor<GameObject, T>
  >(ObjectOrClass: GameObject | T, ...args: U['args']): U['type'] {
    const object =
      ObjectOrClass instanceof GameObject
        ? ObjectOrClass
        : new ObjectOrClass(this.ribbit, args[0], ...args.slice(1))
    this.log?.(`adding object ${object}`)
    this.objects.add(object)
    return object
  }

  /**
   * Remove a game object from this scene.
   */
  remove(object: GameObject): void {
    this.log?.(`removing object ${object}`)
    this.objects.remove(object)
  }

  /**
   * Render all objects in this scene.
   */
  render(): void {
    const contexts = this.ribbit.layers.map((layer) => layer.ctx)
    for (const object of this.objects) {
      contexts.forEach((ctx) => ctx.save())
      object.beforeRender()
      object.render()
      object.afterRender()
      contexts.forEach((ctx) => ctx.restore())
    }
  }

  /**
   * Update all objects in this scene.
   */
  update(dt: number): void {
    for (const object of this.objects) {
      object.beforeUpdate(dt)
      object.update(dt)
      object.afterUpdate(dt)
    }
  }
}

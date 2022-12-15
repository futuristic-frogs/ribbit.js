import { Collection } from './Collection.mjs'
import { GameObject } from './GameObject.mjs'
import type { Ribbit } from './Ribbit.mjs'
import { RibbitObject } from './RibbitObject.mjs'
import type { Constructor, ConstructorArgs } from './types.mjs'

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
   *
   * Note: adding GameObjects and other initialization logic should be done in
   * the `init` method, not in the constructor.
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
  add<T extends Constructor<GameObject>>(
    ObjectClass: T,
    ...args: ConstructorArgs<GameObject, T, [Scene]>
  ): InstanceType<T>

  add<T extends Constructor<GameObject>>(
    ObjectOrClass: GameObject | T,
    ...args: ConstructorArgs<GameObject, T, [Scene]>
  ): InstanceType<T> {
    const object =
      ObjectOrClass instanceof GameObject
        ? ObjectOrClass
        : new ObjectOrClass(this.ribbit, this, ...args)
    this.log?.(`adding object ${object}`)
    this.objects.add(object)

    object.init(this)

    return object as InstanceType<T>
  }

  /**
   * Called when this scene is initialized (i.e. when it is added to the game).
   * Add GameObjects, initialize state, etc. here.
   */
  init(): void {}

  /**
   * Called when this scene is destroyed (i.e. when it is removed from the
   * game). Perform any necessary cleanup here.
   */
  destroy(): void {}

  /**
   * Called when this scene is set as the active scene. A scene may be activated
   * and deactivated multiple times during the course of a game. Override this
   * method to perform any setup that needs to be done when the scene is
   * activated.
   */
  activate(): void {}

  /**
   * Called when this scene is no longer the active scene. A scene may be
   * activated and deactivated multiple times during the course of a game.
   * Override this method to perform any cleanup that needs to be done when the
   * scene is deactivated.
   */
  deactiveate(): void {}

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

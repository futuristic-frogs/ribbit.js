import { Component, ComponentCollection } from './Component.mjs'
import { GameObjectDebugger } from './components/GameObjectDebugger.mjs'
import { Ribbit } from './Ribbit.mjs'
import { RibbitObject } from './RibbitObject.mjs'
import { Scene } from './Scene.mjs'
import { Constructor, ConstructorType } from './types.mjs'
import { Vec2d } from './Vec2d.mjs'

/**
 * A GameObject represents any object in the game world/scene. It is a container
 * for multiple {@link Component}s, which are responsible for rendering and
 * updating the GameObject.
 *
 * All GameObjects have a position ({@link pos}), which is a {@link Vec2d} representing the
 * top-left corner of the GameObject.
 *
 * GameObjects are also responsible for calling the lifecycle methods of their
 * components.
 *
 * Most GameObjects will have some sort of renderer component, which is responsible
 * for defining how the GameObject is rendered. For example, a {@link objects!Rectangle}
 * GameObject will have a {@link components!RectangleRenderer} component.
 *
 * GameObjects can also have other components, such as a {@link RectangleCollider}
 * component for collision detection, or an {@link MouseListener} component for
 * handling mouse events.
 */
export abstract class GameObject extends RibbitObject {
  /**
   * A collection of all the components attached to this GameObject.
   */
  readonly components = new ComponentCollection()

  /**
   * The position of the GameObject. This is the top-left corner of the
   * GameObject.
   */
  pos: Vec2d

  /**
   * Create a new GameObject.
   *
   * Note: adding components and other initialization logic should be done in
   * the `init` method, not in the constructor.
   */
  constructor(ribbit: Ribbit, pos: Vec2d) {
    super(ribbit, 'o')
    this.pos = pos
    if (
      ribbit.options.debug === true ||
      (ribbit.options.debug !== false && ribbit.options.debug?.objects)
    ) {
      this.add(GameObjectDebugger)
    }
  }

  /**
   * Add an existing component to this GameObject.
   * @returns The added component.
   */
  add(component: Component): Component
  /**
   * Create a new component and add it to this GameObject.
   * @param ComponentClass The class of the component to create.
   * @param args The arguments to pass to the component's constructor.
   * @returns The added component.
   */
  add<
    T extends ConstructorType<Component>,
    U extends Constructor<Component, T, [GameObject]> = Constructor<Component, T, [GameObject]>
  >(ComponentClass: T, ...args: U['args']): U['type']

  add(ComponentOrClass: Component | ConstructorType<Component>, ...args: any[]): Component {
    const component =
      ComponentOrClass instanceof Component
        ? ComponentOrClass
        : new ComponentOrClass(this.ribbit, this, ...args)
    this.log?.(`registering component ${component}`)
    this.components.add(component)
    return component
  }

  /**
   * Called when the GameObject is initialized. Add components and other setup
   * here.
   * @param scene The scene that the GameObject is being added to.
   */
  init(scene: Scene): void {}

  /**
   * Called when the GameObject is destroyed. Perform any necessary cleanup
   * here.
   */
  destroy(): void {}

  /**
   * Remove a component from this GameObject by its ID.
   */
  remove(id: string): void
  /**
   * Remove a component from this GameObject.
   */
  remove(component: Component): void
  /**
   * Remove a component from this GameObject by its class. If there are multiple
   * components of the same class, only the first one will be removed.
   */
  remove(ComponentClass: typeof Component): void
  remove(selector: string | Component | typeof Component): void {
    let component
    if (typeof selector === 'string') {
      component = this.components.get(selector)
    } else if (selector instanceof Component) {
      component = selector
    } else {
      component = this.components.find((c) => c instanceof selector)
    }
    if (!component) return
    this.log?.(`unregistering component ${component}`)
    this.components.remove(component)
  }

  /**
   * The `beforeRender` lifecycle method is called before the GameObject is
   * rendered. Operations such as canvas transformations should be done here.
   */
  beforeRender(): void {
    this.components.beforeRender()
  }

  /**
   * The `render` lifecycle method is called when the GameObject should be rendered.
   */
  render(): void {
    this.components.render()
  }

  /**
   * The `afterRender` lifecycle method is called after the GameObject is
   * rendered. Finalizations/paints can be done here.
   */
  afterRender(): void {
    this.components.afterRender()
  }

  /**
   * The `beforeUpdate` lifecycle method is called before the GameObject is updated.
   * @param dt The time since the last update, in milliseconds.
   */
  beforeUpdate(dt: number): void {
    this.components.beforeUpdate(dt)
  }

  /**
   * The `update` lifecycle method is called when the GameObject should be updated.
   * @param dt The time since the last update, in milliseconds.
   */
  update(dt: number): void {
    this.components.update(dt)
  }

  /**
   * The `afterUpdate` lifecycle method is called after the GameObject is updated.
   * @param dt The time since the last update, in milliseconds.
   */
  afterUpdate(dt: number): void {
    this.components.afterUpdate(dt)
  }

  details(): Record<string, any> {
    return {
      pos: this.pos,
    }
  }
}

import packageJson from '../package.json'
import { Collection } from './Collection.mjs'
import { Logan, logan, logInfo } from './console.mjs'
import { IdRegistry } from './IdRegistry.mjs'
import { Keyboard } from './Keyboard.mjs'
import { Layer } from './Layer.mjs'
import { RibbitDebugger } from './objects/RibbitDebugger.mjs'
import { Scene } from './Scene.mjs'
import { Texture } from './Texture.mjs'
import { TextureRegistry } from './TextureRegistry.mjs'
import type { Constructor, ConstructorArgs } from './types.mjs'
import { Vec2d } from './Vec2d.mjs'

export interface RibbitOptions {
  /**
   * Whether to enable the Ribbit debugger overlays and logging. Note that the
   * debugger adds a significant amount of overhead to the game, so it should
   * only be enabled during development.
   */
  debug?: boolean | { logging?: boolean; engine?: boolean; objects?: boolean }
  /**
   * Whether to enable canvas transparency. Disabling this can enable some extra
   * performance optimizations in the browser.
   */
  alpha?: boolean
}

/**
 * The main Ribbit engine class. This is the entry point for all Ribbit games.
 */
export class Ribbit {
  /**
   * The ID registry for this instance, which manages unique IDs for all objects.
   */
  readonly idRegistry = new IdRegistry()
  /**
   * The texture registry for this instance, which manages all textures.
   */
  readonly textureRegistry = new TextureRegistry()

  /**
   * The current keyboard state.
   */
  readonly keyboard: Keyboard

  readonly #ctx: CanvasRenderingContext2D

  readonly size: Vec2d

  /**
   * The collection of registered layers in this instance. By default, there are
   * two layers: `default` and `debug`. The `default` layer is used for all
   * objects, while the `debug` layer is used for debug information.
   */
  readonly layers: Collection<Layer>

  /**
   * The collection of registered scenes in this instance.
   */
  readonly scenes = new Collection<Scene>()

  /**
   * The version of Ribbit, e.g. `0.1.0-alpha0`.
   */
  static readonly version = packageJson.version

  #activeScene?: Scene
  /**
   * The currently active scene.
   */
  get activeScene(): Scene | undefined {
    return this.#activeScene
  }

  /**
   * The Ribbit debugger overlay, if enabled.
   */
  debugger?: RibbitDebugger

  #log: Logan | undefined
  #shouldStop = false
  #lastTime = 0

  readonly canvas: HTMLCanvasElement
  readonly options: RibbitOptions

  constructor(options: RibbitOptions & { canvas: HTMLCanvasElement })
  constructor(canvas: HTMLCanvasElement, options: RibbitOptions)
  /**
   * Create a new Ribbit instance.
   * @param canvas The canvas element to render into.
   * @param options The options to use for this instance.
   */
  constructor(
    canvasOrOptions: HTMLCanvasElement | (RibbitOptions & { canvas: HTMLCanvasElement }),
    options: RibbitOptions = {}
  ) {
    if ('canvas' in canvasOrOptions) {
      this.canvas = canvasOrOptions.canvas
      const options = { ...canvasOrOptions } as any
      delete options.canvas
      this.options = options
    } else {
      this.canvas = canvasOrOptions
      this.options = options
    }
    if (options.debug === true || (options.debug !== false && options.debug?.engine)) {
      // special case for RibbitDebugger - doesn't belong to a scene
      this.debugger = new RibbitDebugger(this, null!)
      this.debugger.init(null!) // no scene
    }

    this.#ctx = this.canvas.getContext('2d', { alpha: this.options.alpha })!
    this.#ctx.imageSmoothingEnabled = false
    this.size = new Vec2d(this.canvas.width, this.canvas.height)

    this.#log = this.options.debug ? logan(this) : undefined

    this.keyboard = new Keyboard(this)

    this.layers = new Collection<Layer>(
      new Layer(this, 'default', 0),
      new Layer(this, 'debug', 9999)
    )

    logInfo(Ribbit.version, this.canvas.width, this.canvas.height)
  }

  /**
   * An alias for `idRegistry.id()`, which returns a unique ID for the given namespace.
   * @param namespace The ID namespace (generally a single letter).
   */
  id(namespace: string): string {
    return this.idRegistry.id(namespace)
  }

  /**
   * An alias for `idRegistry.custom()`, which returns a custom ID for the given namespace.
   * @param namespace The ID namespace (generally a single letter).
   * @param id The custom ID.
   */
  customId(namespace: string, id: string): string {
    return this.idRegistry.custom(namespace, id)
  }

  /**
   * Get a layer by its ID, or the default layer if no ID is provided.
   * @param id The layer ID, without the namespace.
   */
  layer(id: string = 'default'): Layer {
    const layer = this.layers.get(`l$${id}`)
    if (!layer) throw new Error(`layer ${id} not found`)
    return layer
  }

  /**
   * Register a scene with the engine.
   * @returns The scene that was registered.
   */
  addScene(scene: Scene): Scene
  /**
   * Register a scene with the engine.
   * @param SceneClass The scene class to instantiate.
   * @param args The arguments to pass to the scene constructor.
   */
  addScene<T extends Constructor<Scene>>(
    SceneClass: T,
    ...args: ConstructorArgs<Scene, T>
  ): InstanceType<T>

  addScene<T extends Constructor<Scene>>(
    SceneOrClass: Scene | T,
    ...args: ConstructorArgs<Scene, T>
  ): InstanceType<T> {
    const scene = SceneOrClass instanceof Scene ? SceneOrClass : new SceneOrClass(this, ...args)
    this.#log?.(`registering scene ${scene}`)
    this.scenes.add(scene)

    if (!this.#activeScene) {
      this.activate(scene)
    }

    scene.init()

    return scene as InstanceType<T>
  }

  /**
   * Remove a scene from the engine.
   */
  removeScene(scene: Scene): void {
    this.#log?.(`unregistering scene ${scene}`)
    this.scenes.remove(scene)

    if (this.#activeScene === scene) {
      this.#activeScene = undefined
    }

    scene.destroy()
  }

  /**
   * Add a texture to the game.
   * @param texture An existing texture.
   * @returns The texture that was added.
   */
  addTexture(texture: Texture): Texture
  /**
   * Create and add a texture to the game.
   * @param color A CSS color string, e.g. `#ff0000` or `red`.
   * @returns The texture that was added.
   */
  addTexture(color: string): Texture
  /**
   * Create and add a texture to the game.
   * @param image An image element.
   * @param scale The scale of the texture (default: 1).
   * @returns The texture that was added.
   */
  addTexture(image: HTMLImageElement, scale?: number): Texture
  addTexture(textureOrTexType: Texture | string | HTMLImageElement, scale?: number): Texture {
    const tex =
      textureOrTexType instanceof Texture
        ? textureOrTexType
        : new Texture(this, textureOrTexType as any, scale)
    this.#log?.(`registering texture ${tex}`)
    this.textureRegistry.add(tex)
    return tex
  }

  /**
   * Remove a texture from the game.
   */
  removeTexture(texture: Texture): void {
    this.#log?.(`unregistering texture ${texture}`)
    this.textureRegistry.remove(texture)
  }

  /**
   * Select a scene to be the active scene.
   * @param scene The scene or ID of the scene to select.
   */
  activate(scene: Scene | string): void {
    this.#log?.(`activating scene ${scene}`)
    const lastScene = this.#activeScene

    if (typeof scene === 'string') {
      this.#activeScene = this.scenes.get(scene)
    } else {
      this.#activeScene = scene
    }

    lastScene?.deactiveate()
    this.#activeScene?.activate()
  }

  /**
   * Render a single frame.
   */
  render(): void {
    this.#ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (const layer of this.layers) {
      layer.ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height)
    }

    this.#activeScene?.render()
    this.debugger?.render()

    const layers = this.layers.values().sort((a, b) => a.z - b.z)
    for (const layer of layers) {
      this.#ctx.drawImage(layer.canvas, 0, 0)
    }
  }

  /**
   * Update the game state.
   * @param dt The time since the last update, in milliseconds.
   */
  update(dt: number): void {
    this.#activeScene?.update(dt)
    this.debugger?.update(dt)
  }

  toString(): string {
    return 'Ribbit()'
  }

  /**
   * Start the game loop. Waits for all textures to load before starting.
   * @returns A promise that resolves when the game loop is started.
   */
  async run(): Promise<void> {
    this.#log?.('waiting for textures to load')
    await this.textureRegistry.wait()

    this.#log?.('running')
    this.#shouldStop = false
    this.#lastTime = document.timeline.currentTime ?? performance.now()
    const loop = (time: number): void => {
      if (this.#shouldStop) {
        return
      }

      const dt = time - this.#lastTime
      this.#lastTime = time

      this.update(dt)
      this.render()

      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)
  }

  /**
   * Signal the game loop to stop. The loop will stop after the current frame.
   */
  stop(): void {
    this.#log?.('stopping')
    this.#shouldStop = true
  }
}

import { Collection } from './Collection.mjs'
import type { Texture } from './Texture.mjs'

/**
 * The texture registry manages all textures in a Ribbit instance.
 */
export class TextureRegistry {
  /**
   * The collection of textures in this registry.
   */
  readonly textures = new Collection<Texture>()
  /**
   * A map of textures to their ready promises.
   */
  readonly #ready = new WeakMap<Texture, Promise<void>>()

  /**
   * Get a texture by its ID.
   */
  get(id: string): Texture | undefined {
    return this.textures.get(id)
  }

  /**
   * Get a texture by its ID, or throw an error if it doesn't exist.
   */
  getX(id: string): Texture {
    const texture = this.get(id)
    if (!texture) {
      throw new Error(`Texture not found: ${id}`)
    }
    return texture
  }

  /**
   * Add a texture to this registry.
   * @returns The texture that was added.
   */
  add(texture: Texture): Texture {
    this.textures.add(texture)
    if (texture.image) {
      this.#ready.set(
        texture,
        new Promise((resolve) => {
          texture.image!.onload = () => resolve()
        })
      )
    }
    return texture
  }

  /**
   * Remove a texture from this registry.
   */
  remove(texture: Texture): void {
    this.textures.remove(texture)
    this.#ready.delete(texture)
  }

  /**
   * Wait for all textures to be ready. This includes waiting for all registered
   * image textures to fire their `onload` event.
   * @returns A promise that resolves when all textures are ready.
   */
  async wait(): Promise<void> {
    await Promise.all(this.textures.map((texture) => this.#ready.get(texture)))
  }
}

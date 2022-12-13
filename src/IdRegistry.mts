import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12)

/**
 * An ID registry keeps track of IDs and ensures that they are unique. IDs are
 * namespaced, so that IDs for different types of objects can be kept separate.
 * IDs are generated using nanoid.
 *
 * @example
 * const registry = new IdRegistry()
 * registry.id('a') // 'a$1234567890ab'
 * registry.id('b') // 'b$234567890abc'
 * registry.id('a') // 'a$34567890abcd'
 */
export class IdRegistry {
  /**
   * A map of namespaces to IDs. Each namespace is a map of IDs to booleans for
   * fast lookups.
   */
  readonly namespaces: Record<string, Record<string, boolean>> = {}

  /**
   * Generate a new ID in the given namespace.
   * @param namespace The namespace to generate the ID in (typically a single letter).
   * @returns The new ID.
   */
  id(namespace: string): string {
    this.namespaces[namespace] ??= {}

    let id: string
    do {
      id = nanoid()
    } while (this.namespaces[namespace][id])

    this.namespaces[namespace][id] = true

    return `${namespace}$${id}`
  }

  /**
   * Register a custom ID in the given namespace. This is useful for semantically
   * meaningful IDs, such as the IDs of layers.
   */
  custom(namespace: string, id: string): string {
    this.namespaces[namespace] ??= {}
    if (this.namespaces[namespace][id]) {
      throw new Error(`ID ${id} already exists in namespace ${namespace || '(none)'}`)
    }
    this.namespaces[namespace][id] = true
    return `${namespace}$${id}`
  }

  /**
   * Free an ID in the given namespace, signifying that it is no longer in use.
   */
  free(namespace: string, id: string): void {
    this.namespaces[namespace] ??= {}
    delete this.namespaces[namespace][id]
  }

  /**
   * Check if an ID exists in the given namespace.
   */
  exists(namespace: string, id: string): boolean {
    this.namespaces[namespace] ??= {}
    return !!this.namespaces[namespace][id]
  }

  toString(): string {
    return `IdRegistry(#namespaces=${Object.keys(this.namespaces).length})`
  }
}

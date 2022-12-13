/**
 * A custom collection class that allows for quick ID or type based lookups, iteration,
 * and mapping. It is used instead of plain arrays for convenience and
 * performance.
 *
 * @template T The type of object to store in the collection. Must have an `id` property for lookups.
 */
export class Collection<T extends { id: string }> {
  /**
   * The objects in the collection, keyed by ID.
   */
  readonly objects: Record<string, T> = {}

  /**
   * A map of objects in the collection, keyed by class. This is used for quick lookups by class.
   */
  readonly typeMap: WeakMap<new (...args: any[]) => T, Record<string, T>> = new WeakMap()

  /**
   * Create a new collection.
   * @param objects An array of objects to add to the collection.
   */
  constructor(...objects: T[]) {
    for (const object of objects) {
      this.add(object)
    }
  }

  /**
   * The number of objects in the collection.
   */
  size(): number {
    return Object.keys(this.objects).length
  }

  /**
   * Get an object from the collection by ID.
   */
  get(id: string): T | undefined
  /**
   * Get an object from the collection by class. The first object (by insertion order) that is an
   * instance of the given class will be returned.
   */
  get<C extends new (...args: any[]) => T>(Class: C): InstanceType<C> | undefined
  get(IdOrClass: string | (new (...args: any[]) => T)): T | undefined {
    if (typeof IdOrClass === 'string') {
      return this.objects[IdOrClass]
    } else {
      for (const object of Object.values(this.objects)) {
        if (object instanceof IdOrClass) {
          return object
        }
      }
    }
  }

  /**
   * Add an object to the collection.
   * @returns The object that was added.
   */
  add(object: T): T {
    const Class = Object.getPrototypeOf(object).constructor
    this.objects[object.id] = object
    this.typeMap.set(Class, {
      ...this.typeMap.get(Class),
      [object.id]: object,
    })
    return object
  }

  /**
   * Remove an object from the collection.
   */
  remove(object: T): void {
    delete this.objects[object.id]
    const Class = Object.getPrototypeOf(object).constructor
    const typeMap = this.typeMap.get(Class)
    delete typeMap?.[object.id]
  }

  /**
   * Check if an object is in the collection.
   */
  has(object: T): boolean
  /**
   * Check if an object with the given ID is in the collection.
   */
  has(id: string): boolean
  /**
   * Check if any objects of the given class are in the collection.
   */
  has(Class: new (...args: any[]) => T): boolean
  has(IdOrClass: string | T | (new (...args: any[]) => T)): boolean {
    if (typeof IdOrClass === 'string') {
      return !!this.objects[IdOrClass]
    } else if (typeof IdOrClass === 'function') {
      return Object.keys(this.typeMap.get(IdOrClass) ?? {}).length > 0
    } else {
      return !!this.objects[IdOrClass.id]
    }
  }

  details(): Record<string, any> {
    return { size: Object.keys(this.objects).length }
  }

  /**
   * Iterate over the objects in the collection, for use with `for...of`.
   *
   * ```ts
   * for (const object of collection) {
   *   console.log(object)
   * }
   * ```
   */
  *[Symbol.iterator](): Iterator<T> {
    for (const id in this.objects) {
      yield this.objects[id]
    }
  }

  /**
   * Map over the objects in the collection to an array of values.
   */
  map<U>(fn: (object: T) => U): U[] {
    return Object.values(this.objects).map(fn)
  }

  /**
   * Map over the objects in the collection to an array of values, then flatten the array.
   */
  flatMap<U>(fn: (object: T) => U | U[]): U[] {
    return Object.values(this.objects).flatMap(fn)
  }

  /**
   * Map over the objects in the collection to a new collection of objects. Note
   * that the values returned by the function must also have an `id`
   * property to work with the collection.
   */
  mapTo<U extends { id: string }>(fn: (object: T) => U): Collection<U> {
    return new Collection<U>(...Object.values(this.objects).map(fn))
  }

  /**
   * Map over the objects in the collection to a new flattened collection of
   * objects. Note that the values returned by the function must also have an
   * `id` property to work with the collection.
   */
  flatMapTo<U extends { id: string }>(fn: (object: T) => U[]): Collection<U> {
    return new Collection<U>(...Object.values(this.objects).flatMap(fn))
  }

  /**
   * Get the IDs of the objects in the collection.
   */
  keys(): string[] {
    return Object.keys(this.objects)
  }

  /**
   * Get the objects in the collection.
   */
  values(): T[] {
    return Object.values(this.objects)
  }

  /**
   * Get the IDs and objects in the collection.
   */
  entries(): Array<[string, T]> {
    return Object.entries(this.objects)
  }

  /**
   * Filter the objects in the collection to a new collection.
   */
  filter(fn: (object: T) => boolean): Collection<T> {
    const collection = new Collection<T>()
    for (const object of this) {
      if (fn(object)) {
        collection.add(object)
      }
    }
    return collection
  }

  /**
   * Find the first object in the collection that matches the given function.
   */
  find(fn: (object: T) => boolean): T | undefined {
    for (const object of this) {
      if (fn(object)) {
        return object
      }
    }
  }

  /**
   * Chunk the objects in the collection into an array of arrays of the given
   * size.
   * @param size The size of each chunk.
   */
  chunk(size: number): T[][] {
    const chunks: T[][] = []
    let chunk: T[] = []
    for (const object of this) {
      chunk.push(object)
      if (chunk.length === size) {
        chunks.push(chunk)
        chunk = []
      }
    }
    if (chunk.length > 0) {
      chunks.push(chunk)
    }
    return chunks
  }
}

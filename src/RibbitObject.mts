import { logan, Logan } from './console.mjs'
import { Ribbit } from './Ribbit.mjs'

export interface RibbitObjectOptions {
  /**
   * The namespace to use for this object's custom ID.
   */
  namespace: string
  /**
   * A custom, un-namespaced ID to use for the object.
   */
  id: string
}

/**
 * The base class for all Ribbit-controlled objects and components. Every object
 * has a unique namespaced ID and maintains a reference to the Ribbit instance
 * it belongs to.
 */
export abstract class RibbitObject {
  /**
   * The unique namespaced ID for this object.
   */
  readonly id: string
  /**
   * A debug logger for this object, if enabled.
   */
  protected readonly log?: Logan

  /**
   * The Ribbit instance this object belongs to.
   */
  readonly ribbit: Ribbit

  /**
   * Create a new RibbitObject.
   * @param ribbit The Ribbit instance this object belongs to.
   * @param namespace The namespace to use for generating the object's ID.
   */
  constructor(ribbit: Ribbit, namespace: string)
  /**
   * Create a new RibbitObject.
   * @param ribbit The Ribbit instance this object belongs to.
   * @param options The options to use for generating the object's ID.
   */
  constructor(ribbit: Ribbit, options: RibbitObjectOptions)
  constructor(ribbit: Ribbit, idNamespaceOrOptions: string | RibbitObjectOptions) {
    this.ribbit = ribbit
    if (typeof idNamespaceOrOptions === 'string') {
      this.id = ribbit.idRegistry.id(idNamespaceOrOptions)
    } else if (idNamespaceOrOptions.namespace) {
      this.id = ribbit.idRegistry.custom(idNamespaceOrOptions.namespace, idNamespaceOrOptions.id)
    } else {
      this.id = ribbit.idRegistry.custom('', idNamespaceOrOptions.id)
    }
    this.log =
      ribbit.options.debug === true ||
      (ribbit.options.debug !== false && ribbit.options.debug?.logging)
        ? logan(this)
        : undefined
  }

  /**
   * Returns a record of details about the object. This is used for debugging.
   */
  details(): Record<string, any> {
    return {}
  }

  /**
   * Returns a string representation of the object containing its ID and any
   * details returned by the {@link details} method. This is used for debugging.
   */
  toString(): string {
    const name = Object.getPrototypeOf(this).constructor.name
    const details = this.details()
    if (Object.keys(details).length > 0) {
      return `${name}(${this.id}, ${Object.entries(details)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ')})`
    } else {
      return `${name}(${this.id})`
    }
  }
}

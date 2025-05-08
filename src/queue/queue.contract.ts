export abstract class Queue<T> {
  /**
   * Insertion of elements to the queue.
   */
  abstract enqueue (val: T): this

  /**
   * Removal of elements from the queue.
   */
  abstract dequeue (): T | undefined

  /**
   * (peek)
   * Get the next element to dequeue without dequeuing it.
   */
  abstract front (): T | undefined

  /**
   * Get the latest added element.
   */
  abstract rear (): T | undefined

  /**
   * Checks if the queue has no elements on it.
   */
  abstract isEmpty (): boolean

  /**
   * Get the amount of elements in the queue
   */
  abstract size (): number
}

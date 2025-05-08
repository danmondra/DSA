import { Queue } from './queue.contract.ts'

/**
 * This is an inefficient implementation because it can only
 * enqueue the established capacity of elements and no matter
 * if all the elements are dequeued, it cannot keep enqueuing
 * more elements.
 * Otherwise, we could shift the array every time we dequeue,
 * and that would cost O(n) because we'd have to copy the
 * entire array.
 */
export class QueueAsStaticArray <T> implements Queue<T> {
  private readonly capacity: number
  private frontIdx: number
  private rearIdx: number

  private readonly q: Array<T | undefined>

  constructor (
    capacity: number
  ) {
    this.capacity = capacity
    this.frontIdx = 0

    // For practicity is better "-1". When the queue
    // is empty this could be any value, but we would
    // need handle specially the first insertion.
    this.rearIdx = -1

    this.q = Object.seal(Array(10).fill(undefined))
  }

  enqueue (value: T): this {
    // This is the same as (this.rearIdx < this.capacity - 1)
    if (this.rearIdx + 1 > this.capacity - 1)
      throw new Error('Full capacity')

    this.q[++this.rearIdx] = value
    return this
  }

  dequeue (): T | undefined {
    if (this.isEmpty()) return undefined

    const dequeuedValue = this.q[this.frontIdx]!
    this.q[this.frontIdx++] = undefined

    return dequeuedValue
  }

  front (): T | undefined {
    if (this.isEmpty()) return undefined

    return this.q.at(this.frontIdx)!
  }

  rear (): T | undefined {
    if (this.isEmpty()) return undefined

    return this.q.at(this.rearIdx)!
  }

  size (): number {
    return this.q.filter(e => e !== undefined).length
  }

  isEmpty (): boolean {
    return this.frontIdx > this.rearIdx
  }

  // Just for testing purposes
  restart (): void {
    this.frontIdx = 0
    this.rearIdx = -1
  }
}

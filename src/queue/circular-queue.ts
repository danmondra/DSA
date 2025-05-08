import assert from 'node:assert'
import test, { describe } from 'node:test'
import { Queue } from './queue.contract.ts'

/**
 * This implementation supose that the array is static.
 * This means we need to wrap around the elements to improve
 * performance. We need to handle the last spot in the list in
 * a special way, making sure when an element is enqueued beyond
 * the capacity, the back should move to the start of the array.
 */
export class CircularQueue<V extends unknown> implements Queue<V> {
  frontIdx: number
  rearIdx: number
  currentSize: number
  private readonly capacity: number

  q: Array<V | undefined>

  constructor (capacity: number) {
    this.frontIdx = 0
    this.rearIdx = -1
    this.currentSize = 0

    this.capacity = capacity
    this.q = Object.seal(Array(capacity).fill(undefined))
  }

  enqueue (value: V): this {
    const indexToEnqueue = this.rearIdx + 1
    const exceedsQueueCapacity = indexToEnqueue > this.capacity - 1

    if (exceedsQueueCapacity && this.q[0] !== undefined)
      throw new Error('Queue is full')

    if (this.q[indexToEnqueue] !== undefined)
      throw new Error('Queue is full')

    this.rearIdx = indexToEnqueue % this.capacity

    // Equivalent:
    // if (indexToEnqueue === this.capacity) this.back = 0
    // else this.back++

    this.q[this.rearIdx] = value
    this.currentSize++
    return this
  }

  dequeue (): V | undefined {
    if (this.isEmpty()) return undefined

    const dequeuedValue = this.q[this.frontIdx]!

    this.q[this.frontIdx] = undefined
    this.frontIdx = (this.frontIdx + 1) % this.capacity
    this.currentSize--

    return dequeuedValue
  }

  isEmpty (): boolean {
    return this.currentSize === 0
  }

  front (): V | undefined {
    if (this.isEmpty()) return undefined

    return this.q[this.frontIdx]!
  }

  rear (): V | undefined {
    if (this.isEmpty()) return undefined

    return this.q[this.rearIdx]!
  }

  size (): number {
    return this.currentSize
  }
}

describe('CircularQueue', () => {
  describe('enqueue', () => {
    test('should enqueue one element when there is room for it', () => {
      const capacity = 10
      const queue = new CircularQueue<number>(capacity)

      for (let i = 0; i < capacity; i++) queue.enqueue(i)

      const expected = [...Array(capacity).keys()]

      assert(queue.rearIdx === capacity - 1)
      assert.deepStrictEqual(queue.q, expected)
    })

    test('should wrap around the queue when the back is at the last element', () => {
      const capacity = 10
      const queue = new CircularQueue<number | string>(capacity)

      for (let i = 0; i < capacity; i++) queue.enqueue(i)
      queue.dequeue()

      queue.enqueue('new value')

      const expected: Array<(number | string)> = [...Array(capacity).keys()]
      expected[0] = 'new value'

      // 0 because wrapped around, the back is now at the start of the array
      assert(queue.rearIdx === 0)
      assert.deepStrictEqual(queue.q, expected)
    })

    test('should throw an error when the queue is not wrapped around and full', () => {
      const capacity = 10
      const queue = new CircularQueue<number>(capacity)

      for (let i = 0; i < capacity; i++) queue.enqueue(i)

      assert.throws(() => queue.enqueue(11))
    })

    test('should throw an error when the queue is wrapped around and full', () => {
      const queue = new CircularQueue<number | string>(10)

      for (let i = 0; i < 10; i++) queue.enqueue(i)
      queue.dequeue()
      queue.enqueue('new value')

      assert.throws(() => queue.enqueue('new value 2'))
    })
  })

  describe('dequeue', () => {
    test('should dequeue one single element', () => {
      const capacity = 10
      const queue = new CircularQueue<string>(capacity)

      queue.enqueue('a')
      queue.dequeue()

      const expected = [...Array(capacity)]

      assert.equal(queue.frontIdx, 1)
      assert.equal(queue.rearIdx, 0)
      assert.deepStrictEqual(queue.q, expected)
    })

    test('should dequeue multiple elements', () => {
      const capacity = 10
      const queue = new CircularQueue<string>(capacity)

      queue.enqueue('a')
      queue.enqueue('b')
      queue.enqueue('c')
      queue.enqueue('d')

      queue.dequeue()
      queue.dequeue()
      queue.dequeue()

      const expected = [...Array(capacity)]
      expected[3] = 'd'

      assert(queue.frontIdx === 3)
      assert(queue.rearIdx === 3)
      assert.deepStrictEqual(queue.q, expected)
    })

    test('should move the front to the start when it is the last element', () => {
      const capacity = 10
      const queue = new CircularQueue<number | string>(capacity)

      for (let i = 0; i < capacity; i++) queue.enqueue(i)
      for (let i = 0; i < capacity - 1; i++) queue.dequeue()

      assert(queue.frontIdx === 9)
      queue.dequeue() // move front to start

      const expected = Array(capacity).fill(undefined)

      // @ts-expect-error
      assert(queue.frontIdx === 0) // 0 because wrapped around
      assert(queue.rearIdx === 9)
      assert.deepStrictEqual(queue.q, expected)
    })
  })
})

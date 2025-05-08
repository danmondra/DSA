import { Queue } from './queue.contract.ts'

export class QueueAsDynamicArray<T> implements Queue<T> {
  private readonly q: T[]

  constructor () {
    this.q = []
  }

  enqueue (value: T): this {
    this.q.push(value)

    return this
  }

  dequeue (): T | undefined {
    return this.q.shift()
  }

  rear (): T | undefined {
    return this.q.at(-1)
  }

  front (): T | undefined {
    return this.q.at(0)
  }

  isEmpty (): boolean {
    return this.q.length === 0
  }

  size (): number {
    return this.q.length
  }
}

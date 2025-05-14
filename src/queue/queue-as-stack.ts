import { StackAsLinkedList } from '../stack/stack-as-linked-list.ts'
import { Queue } from './queue.contract.ts'

/**
 * Implementation inspirated by:
 * https://stackoverflow.com/questions/69192/how-to-implement-a-queue-using-two-stacks
 */
export class QueueAsStack<T> implements Queue<T> {
  private readonly inbox: StackAsLinkedList<T>
  private readonly outbox: StackAsLinkedList<T>
  private currentSize: number

  constructor () {
    this.inbox = new StackAsLinkedList()
    this.outbox = new StackAsLinkedList()
    this.currentSize = 0
  }

  enqueue (val: T): this {
    this.inbox.push(val)
    this.currentSize++

    return this
  }

  dequeue (): T | undefined {
    if (this.isEmpty()) return undefined

    // Reversing a stack (pouring the inbox into the outbox)
    if (this.outbox.isEmpty()) {
      while (!this.inbox.isEmpty())
        this.outbox.push(this.inbox.pop()!)
    }

    this.currentSize--
    return this.outbox.pop()!
  }

  front (): T | undefined {
    if (!this.outbox.isEmpty())
      return this.outbox.top()!

    if (!this.inbox.isEmpty())
      return this.inbox.bottom()!

    return undefined
  }

  rear (): T | undefined {
    if (!this.inbox.isEmpty())
      return this.inbox.top()

    if (!this.outbox.isEmpty())
      return this.outbox.bottom()

    return undefined
  }

  isEmpty (): boolean {
    return this.inbox.isEmpty() && this.outbox.isEmpty()
  }

  size (): number {
    return this.currentSize
  }
}

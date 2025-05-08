import assert from 'assert'
import { QueueAsLinkedList } from '../queue/queue-as-linked-list.ts'
import { Stack } from './stack.contract.ts'
import { testStack } from './stack.test.ts'

export class StackAsQueue<T> implements Stack<T> {
  private inbox = new QueueAsLinkedList<T>()
  private outbox = new QueueAsLinkedList<T>()

  size: number

  constructor () {
    this.size = 0
  }

  push (value: T): void {
    this.inbox.enqueue(value)
    this.size++
  }

  pop (): T | undefined {
    if (this.isEmpty()) return undefined

    while (this.inbox.size() > 1)
      this.outbox.enqueue(this.inbox.dequeue()!)

    const dequeued = this.inbox.dequeue()!
    ;[this.inbox, this.outbox] = [this.outbox, this.inbox]
    this.size--

    return dequeued
  }

  isEmpty (): boolean {
    return this.inbox.isEmpty() && this.outbox.isEmpty()
  }

  top (): T | undefined {
    if (this.isEmpty()) return undefined

    if (!this.inbox.isEmpty()) return this.inbox.rear()

    assert(!this.outbox.isEmpty())
    return this.outbox.rear()!
  }

  bottom (): T | undefined {
    if (this.isEmpty()) return undefined

    if (!this.outbox.isEmpty()) return this.outbox.front()!

    assert(!this.inbox.isEmpty())
    return this.inbox.front()!
  }

  // O(n²)
  toReverse (): Stack<T> {
    const reversedStack = new StackAsQueue<T>()
    if (this.isEmpty()) return reversedStack

    let inboxCopy = this.inbox.copy()
    let inboxHelper = new QueueAsLinkedList<T>()

    while (!inboxCopy.isEmpty()) {
      while (inboxCopy.size() > 1)
        inboxHelper.enqueue(inboxCopy.dequeue()!)

      const lastItem = inboxCopy.dequeue()!

      ;[inboxCopy, inboxHelper] = [inboxHelper, inboxCopy]
      reversedStack.push(lastItem)
    }

    let outboxCopy = this.outbox.copy()
    let outboxHelper = new QueueAsLinkedList<T>()

    while (!outboxCopy.isEmpty()) {
      while (outboxCopy.size() > 1)
        outboxHelper.enqueue(outboxCopy.dequeue()!)

      const lastItem = outboxCopy.dequeue()!

      ;[outboxCopy, outboxHelper] = [outboxHelper, outboxCopy]
      reversedStack.push(lastItem)
    }

    return reversedStack
  }

  private toReverseUsingTraverse (): Stack<T> {
    const reversed = this
      .traverse()
      .toReversed()

    const reversedStack = new StackAsQueue<T>()
    reversed.forEach((el) => reversedStack.push(el))

    return reversedStack
  }

  traverse (): T[] {
    const stack = []

    const outboxCopy = this.outbox.copy()
    while (!outboxCopy.isEmpty())
      stack.push(outboxCopy.dequeue()!)

    const inboxCopy = this.inbox.copy()
    while (!inboxCopy.isEmpty())
      stack.push(inboxCopy.dequeue()!)

    return stack
  }

  clear (): void {
    this.inbox = new QueueAsLinkedList<T>()
    this.outbox = new QueueAsLinkedList<T>()
    this.size = 0
  }
}

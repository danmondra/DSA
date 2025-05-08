import assert from 'node:assert'
import { SinglyLinkedListNode } from '../linked-list/singly-linked-list.ts'
import { Queue } from './queue.contract.ts'

export class QueueAsLinkedList <T> implements Queue <T> {
  private frontNode: SinglyLinkedListNode<T> | null
  private rearNode: SinglyLinkedListNode<T> | null
  private currentSize: number

  constructor () {
    // Could use a dummy node?
    this.frontNode = null
    this.rearNode = null

    this.currentSize = 0
  }

  enqueue (val: T): this {
    const newNode = new SinglyLinkedListNode(val)

    if (this.isEmpty())
      this.frontNode = this.rearNode = newNode
    else
      this.rearNode!.next = this.rearNode = newNode

    this.currentSize++
    return this
  }

  dequeue (): T | undefined {
    if (this.isEmpty()) return undefined

    // deleting the rearnode if there is only one element
    if (this.frontNode === this.rearNode)
      this.rearNode = null

    const value = this.frontNode?.value
    this.frontNode = this.frontNode!.next
    this.currentSize--

    return value
  }

  /**
   * @returns this.frontNode === null && this.rearNode === null
   */
  isEmpty (): boolean {
    const isEmpty = this.frontNode === null

    if (isEmpty) assert(this.rearNode === null)

    return isEmpty
  }

  front (): T | undefined {
    return this.frontNode?.value
  }

  rear (): T | undefined {
    return this.rearNode?.value
  }

  size (): number {
    return this.currentSize
  }

  copy (): QueueAsLinkedList<T> {
    const newQueue = new QueueAsLinkedList<T>()

    let current = this.frontNode
    while (current !== null) {
      newQueue.enqueue(current.value)
      current = current.next
    }

    return newQueue
  }
}

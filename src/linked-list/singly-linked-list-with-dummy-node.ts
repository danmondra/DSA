import { SinglyLinkedListContract } from './singly-linked-list.contract.ts'
import { SinglyLinkedListNode } from './singly-linked-list.ts'

export class SinglyLinkedListNodeWithDummyNode<T> implements SinglyLinkedListContract<T> {
  private head: SinglyLinkedListNode<T> | null
  private currentSize: number

  constructor () {
    this.head = null
    this.currentSize = 0
  }

  insertAt (indexTarget: number, value: T): SinglyLinkedListNode<T> {
    if (indexTarget < 0) throw new Error('Invalid Index')

    if (indexTarget > this.currentSize) throw new Error('Invalid Index')

    const dummyNode = new SinglyLinkedListNode(value)
    dummyNode.next = this.head

    let previous: SinglyLinkedListNode<T> | null = dummyNode
    let count = 0

    while (count < indexTarget) {
      previous = previous!.next
      count++
    }

    const newNode = new SinglyLinkedListNode(value)
    newNode.next = previous!.next
    previous!.next = newNode
    this.currentSize++

    this.head = dummyNode.next
    return dummyNode.next!
  }

  removeAt (index: number): SinglyLinkedListNode<T> | null {
    if (index < 0)
      throw new Error('Invalid Index')

    if (this.currentSize <= index)
      throw new Error('Invalid Index')

    const dummyNode = new SinglyLinkedListNode(null as T)
    dummyNode.next = this.head

    let previous = dummyNode
    let count = 0

    while (count < index) {
      previous = previous.next!
      count++
    }

    const removed = previous.next
    previous.next = previous.next!.next
    this.currentSize--

    this.head = dummyNode.next
    return removed
  }

  at (index: number): SinglyLinkedListNode<T> | null {
    if (index < 0)
      throw new Error('Invalid Index: Index must be greater than -1')

    if (this.currentSize <= index)
      throw new Error('Invalid Index: Index must be greater than -1')

    let current = this.head
    let counter = 0

    while (counter < index) {
      current = current!.next
      counter++
    }

    return current
  }

  search (value: T): SinglyLinkedListNode<T> | null {
    let current = this.head

    while (current !== null) {
      if (current.value === value) return current

      current = current.next!
    }

    return null
  }

  traverse (): T[] {
    const list = []
    let current = this.head

    while (current !== null) {
      list.push(current.value)
      current = current.next!
    }

    return list
  }

  size (): number {
    return this.currentSize
  }

  clear (): void {
    this.head = null
    this.currentSize = 0
  }
}

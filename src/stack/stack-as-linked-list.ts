import { SinglyLinkedListNode } from '../linked-list/singly-linked-list.ts'
import { Stack } from './stack.contract.ts'

export class StackAsLinkedList<T extends unknown> implements Stack<T> {
  size: number
  private topNode: SinglyLinkedListNode<T> | null

  constructor () {
    this.topNode = null
    this.size = 0
  }

  push (value: T): void {
    const newNode = new SinglyLinkedListNode(value)
    newNode.next = this.topNode
    this.topNode = newNode

    this.size++
  }

  pop (): T | undefined {
    if (!this.topNode) return undefined

    const value = this.topNode.value
    this.topNode = this.topNode.next
    this.size--

    return value
  }

  top (): T | undefined {
    if (!this.topNode) return undefined

    return this.topNode.value
  }

  bottom (): T | undefined {
    if (!this.topNode) return undefined

    let current = this.topNode
    while (current.next)
      current = current.next

    return current.value
  }

  isEmpty (): boolean {
    return this.size === 0
  }

  toReverse (): StackAsLinkedList<T> {
    const reversedStack = new StackAsLinkedList<T>()

    let current = this.topNode
    while (current) {
      reversedStack.push(current.value)
      current = current.next
    }

    return reversedStack
  }

  traverse (): T[] {
    let current = this.topNode
    const array = []

    while (current) {
      array.unshift(current.value)
      current = current.next
    }

    return array
  }

  clear (): void {
    this.topNode = null
    this.size = 0
  }
}

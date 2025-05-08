import { SinglyLinkedListContract } from './singly-linked-list.contract.ts'

export class SinglyLinkedListNode<T> {
  value: T
  next: SinglyLinkedListNode<T> | null

  constructor (value: T, next: SinglyLinkedListNode<T> | null = null) {
    this.value = value
    this.next = next
  }
}

export class SinglyLinkedList <T> implements SinglyLinkedListContract<T> {
  private head: SinglyLinkedListNode<T> | null

  private currentSize: number

  constructor () {
    this.head = null
    this.currentSize = 0
  }

  private pushFront (value: T): SinglyLinkedListNode<T> {
    const newHead = new SinglyLinkedListNode(value)
    newHead.next = this.head
    this.head = newHead
    this.currentSize++

    return this.head
  }

  insertAt (indexTarget: number, value: T): SinglyLinkedListNode<T> {
    if (indexTarget < 0)
      throw new Error('Invalid Index')

    if (indexTarget > this.currentSize)
      throw new Error('Invalid Index')

    if (indexTarget === 0)
      return this.pushFront(value)

    let previous = this.head

    /**
    * With "count = 1" instead of "count = 0" we avoid to declare a
    * "current" variable. Also, we avoid an extra iteration to set
    * "current" to null in the last spot.
    * Also can assert that "previous" is always "!== null".
    *
    * When count starts in 1
    * target     =                 3
    * condition  =  <    <    = <- stop
    * count      =  1    2    3
    * previous   = 'a'  'b'  'c'
    *            = 'a'  'b'  'c'  'x'
    *
    * When count starts in 0 (one useless extra iteration)
    * target     =                 3
    * condition  =  <    <    <    = <- stop
    * count      =  0    1    2    3
    * current    = 'a'  'b'  'c'  null
    * previous   = null 'a'  'b'  'c'
    *
    *            = 'a'  'b'  'c'  'x'
    */
    let count = 1

    while (count < indexTarget) {
      previous = previous!.next
      count++
    }

    const newNode = new SinglyLinkedListNode(value)
    newNode.next = previous!.next
    previous!.next = newNode
    this.currentSize++

    return this.head!
  }

  removeAt (index: number): SinglyLinkedListNode<T> | null {
    if (index < 0)
      throw new Error('Invalid Index: Index must be greater than -1')

    if (index >= this.currentSize)
      throw new Error('Invalid Index')

    if (this.head === null)
      return null

    if (index === 0) {
      const removed = this.head
      this.head = this.head.next
      this.currentSize--

      return removed
    }

    let previous = this.head
    let count = 1

    while (count < index) {
      previous = previous.next!
      count++
    }

    const removed = previous.next
    previous.next = previous.next!.next
    this.currentSize--

    return removed
  }

  at (index: number): SinglyLinkedListNode<T> | null {
    if (index >= this.currentSize)
      throw new Error('Invalid Index: The provided index is bigger than the length of the list')

    if (index < 0)
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
    const values: T[] = []
    let current = this.head

    while (current !== null) {
      values.push(current.value)
      current = current.next
    }

    return values
  }

  size (): number {
    return this.currentSize
  }

  clear (): void {
    this.head = null
    this.currentSize = 0
  }
}

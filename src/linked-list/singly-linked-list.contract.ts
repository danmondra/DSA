import { SinglyLinkedListNode } from './singly-linked-list.ts'

export abstract class SinglyLinkedListContract <T> {
  abstract insertAt (at: number, value: T): SinglyLinkedListNode<T>

  abstract removeAt (index: number): SinglyLinkedListNode<T> | null

  abstract at (index: number): SinglyLinkedListNode<T> | null

  abstract search (value: T): SinglyLinkedListNode<T> | null

  abstract traverse (): T[]

  abstract size (): number

  abstract clear (): void
}

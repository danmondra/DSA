export abstract class Stack<T> {
  abstract size: number

  abstract push (value: T): void

  abstract pop (): T | undefined

  /** (peek) */
  abstract top (): T | undefined

  abstract bottom (): T | undefined

  abstract isEmpty (): boolean

  abstract toReverse (): Stack<T>

  abstract traverse (): T[]

  abstract clear (): void
}

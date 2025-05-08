import { Stack } from './stack.contract.ts'

export class StackAsArray<T extends unknown> implements Stack<T> {
  private readonly capacity: number
  private indexTop: number
  stack: Array<T | undefined>

  constructor (capacity: number) {
    this.indexTop = -1
    this.capacity = capacity
    this.stack = Object.seal(Array(capacity).fill(undefined))
  }

  push (value: T): void {
    if (this.indexTop === this.capacity - 1)
      throw new Error('Exceeded Capacity')

    this.stack[++this.indexTop] = value
  }

  pop (): T | undefined {
    if (this.isEmpty()) return undefined

    const oldValue = this.stack[this.indexTop]!
    this.stack[this.indexTop--] = undefined

    return oldValue
  }

  top (): T | undefined {
    if (this.isEmpty()) return undefined

    return this.stack[this.indexTop]!
  }

  bottom (): T | undefined {
    if (this.isEmpty()) return undefined

    return this.stack[0]!
  }

  isEmpty (): boolean {
    return this.indexTop < 0
  }

  toReverse (): StackAsArray<T> {
    const reversedStack = new StackAsArray<T>(this.capacity)

    for (let i = this.indexTop; i >= 0; i--)
      reversedStack.push(this.stack[i] as T)

    return reversedStack
  }

  traverse (): T[] {
    return this.stack.filter(el => el !== undefined)
  }

  clear (): void {
    this.indexTop = -1
    this.stack = Object.seal(Array(this.capacity).fill(undefined))
  }

  get size (): number {
    return this.stack.filter(el => el !== undefined).length
  }
}

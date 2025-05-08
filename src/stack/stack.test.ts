import test, { beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import { Stack } from './stack.contract.ts'
import { StackAsArray } from './stack-as-array.ts'
import { StackAsLinkedList } from './stack-as-linked-list.ts'
import { StackAsQueue } from './stack-as-queue.ts'

export const testStack = (
  s: Stack<any>,
  options?: { capacity: number }
): any => describe(s.constructor.name, () => {
  beforeEach(() => {
    s.clear()
  })

  describe('size', () => {
    test('should return 0 for a newly created stack', () => {
      assert.strictEqual(s.size, 0)
    })

    test('should return the correct size after pushing elements', () => {
      s.push('a')
      s.push('b')
      s.push('c')
      s.push('d')

      assert.strictEqual(s.size, 4)
    })

    test('should return the correct size after pushing and popping elements', () => {
      s.push('a')
      s.push('b')
      s.push('c')
      assert.strictEqual(s.size, 3)

      s.pop()
      assert.strictEqual(s.size, 2)

      s.push('x')
      assert.strictEqual(s.size, 3)
    })
  })

  describe('push', () => {
    test('should add an element to the top of the stack', () => {
      s.push('a')
      s.push('b')

      assert.strictEqual(s.top(), 'b')
      assert.strictEqual(s.size, 2)
    })

    test('should increase the size of the stack by 1', () => {
      s.push('a')
      s.push('b')
      s.push('c')

      assert.strictEqual(s.top(), 'c')
      assert.strictEqual(s.size, 3)
    })

    ;(
      options?.capacity !== undefined
        ? test
        : test.skip
    )('should throw an error if the capacity is exceeded', () => {
      for (let i = 1; i <= options!.capacity; i++)
        s.push(i)

      assert.throws(() => s.push(10), /Exceeded Capacity/)
    })
  })

  describe('pop', () => {
    test('should remove and return the element at the top of the stack', () => {
      s.push('a')
      s.push('b')
      s.push('c')

      assert.strictEqual(s.size, 3)
      assert.strictEqual(s.top(), 'c')

      assert.strictEqual(s.pop(), 'c')
      assert.strictEqual(s.top(), 'b')
      assert.strictEqual(s.size, 2)
    })

    test('should return `undefined` if the stack is empty', () => {
      assert.strictEqual(s.size, 0)
      assert.strictEqual(s.pop(), undefined)
    })

    test('should maintain stack order with multiple pops', () => {
      s.push('a')
      s.push('b')
      s.push('c')
      s.push('d')

      s.pop()
      s.pop()

      assert.strictEqual(s.size, 2)
      assert.strictEqual(s.top(), 'b')
      assert.strictEqual(s.bottom(), 'a')
    })
  })

  describe('top', () => {
    test('should return the element at the top of the stack without removing it', () => {
      s.push('a')
      s.push('b')
      s.push('c')
      s.push('d')

      assert.strictEqual(s.size, 4)
      assert.strictEqual(s.top(), 'd')
      assert.strictEqual(s.size, 4)
    })

    test('should return `undefined` if the stack is empty', () => {
      assert.strictEqual(s.top(), undefined)
    })
  })

  describe('bottom', () => {
    test('should return the element at the bottom of the stack without removing it', () => {
      s.push('a')
      s.push('b')
      s.push('c')
      s.push('d')

      assert.strictEqual(s.size, 4)
      assert.strictEqual(s.bottom(), 'a')
      assert.strictEqual(s.size, 4)
    })

    test('should return `undefined` if the stack is empty', () => {
      assert.strictEqual(s.bottom(), undefined)
    })

    test('should return the same element as `top` if the stack has only one element', () => {
      s.push('a')

      assert.strictEqual(s.top(), s.bottom())
    })
  })

  describe('isEmpty', () => {
    test('should return `true` for a newly created stack', () => {
      assert(s.isEmpty())
    })

    test('should return `false` after pushing an element', () => {
      s.push('a')

      assert(!s.isEmpty())
    })

    test('should return `true` after pushing and popping all elements', () => {
      s.push('a')
      s.pop()

      assert(s.isEmpty())
    })
  })

  describe('toReverse', () => {
    test('should return a new stack with the elements in reversed order', () => {
      s.push('a')
      s.push('b')
      s.push('c')

      const reversed = s.toReverse()

      assert.strictEqual(reversed.top(), s.bottom())
      assert.strictEqual(reversed.bottom(), s.top())
    })
  })

  describe('traverse', () => {
    test('should return an empty array if the stack is empty', () => {
      assert.deepStrictEqual(s.traverse(), [])
    })

    test('should return an array with the stack values from bottom to top', () => {
      s.push('a')
      s.push('b')
      s.push('c')

      assert.deepStrictEqual(s.traverse(), ['a', 'b', 'c'])
    })
  })

  describe('clear', () => {
    test('should remove all elements from the stack', () => {
      s.push('a')
      s.push('b')
      s.push('c')

      s.clear()

      assert(s.top() === undefined)
      assert(s.bottom() === undefined)
    })

    test('should set the size of the stack to 0', () => {
      s.push('a')
      s.push('b')
      s.push('c')

      s.clear()

      assert(s.size === 0)
    })

    test('should make `isEmpty()` return `true`', () => {
      s.push('a')
      s.push('b')
      s.push('c')

      s.clear()

      assert(s.isEmpty())
    })
  })
})

;([
  [new StackAsArray(10), { capacity: 10 }],
  [new StackAsLinkedList()],
  [new StackAsQueue()]
] satisfies Array<Parameters<typeof testStack>>).forEach(([s, options]) =>
  testStack(s, options)
)

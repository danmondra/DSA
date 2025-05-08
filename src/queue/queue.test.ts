import test, { describe } from 'node:test'
import assert from 'node:assert'
import { QueueAsLinkedList } from './queue-as-linked-list.ts'
import { Queue } from './queue.contract.ts'
import { CircularQueue } from './circular-queue.ts'
import { QueueAsDynamicArray } from './queue-as-dynamic-array.ts'
import { QueueAsStaticArray } from './queue-as-static-array.ts'
import { QueueAsStack } from './queue-as-stack.ts'

type QueueImplementation<T> = {
  q: Queue<T>
  limitedCapacity?: 10
}

const testQueue = ({
  q,
  limitedCapacity
}: QueueImplementation<any>): any => describe(q.constructor.name, () => {
  test.beforeEach(() => {
    while (!q.isEmpty())
      q.dequeue()

    if (q.constructor.name === 'QueueAsStaticArray')
      (q as any).restart()
  })

  describe('enqueue', () => {
    test('adds an element to an empty queue', () => {
      q.enqueue('a')

      assert(!q.isEmpty())
      assert(q.front() === 'a')
      assert(q.rear() === 'a')
      assert(q.size() === 1)
    })

    test('adds multiple elements to the queue', () => {
      q.enqueue('a')
      q.enqueue('b')
      q.enqueue('c')

      assert(!q.isEmpty())
      assert(q.front() === 'a')
      assert(q.rear() === 'c')
      assert(q.size() === 3)
    })

    test('maintains FIFO order when adding elements', () => {
      q.enqueue('c')
      q.enqueue('b')
      q.enqueue('a')

      assert(q.rear() === 'a')
      assert(q.front() === 'c')
    })

    ;(limitedCapacity ? test : test.skip)('should throw an error if capacity is exceeded', () => {
      for (let i = 1; i <= limitedCapacity!; i++)
        q.enqueue(i)

      assert.throws(() => q.enqueue(limitedCapacity! + 1))
    })
  })

  describe('dequeue', () => {
    test('removes and returns the front element from a non-empty queue', () => {
      q.enqueue('a')
      const res = q.dequeue()

      assert(q.isEmpty())
      assert(res === 'a')
    })

    test('returns undefined when dequeuing from an empty queue', () => {
      assert(q.isEmpty())
      const res = q.dequeue()

      assert(q.isEmpty())
      assert(res === undefined)
    })

    test('maintains FIFO order when dequeuing', () => {
      q.enqueue('f')
      q.enqueue('e')
      q.enqueue('d')
      q.enqueue('c')
      q.enqueue('b')
      q.enqueue('a')

      q.dequeue()
      q.dequeue()
      q.dequeue()

      assert(q.front() === 'c')
      assert(q.rear() === 'a')
    })

    test('dequeues all elements until the queue is empty', () => {
      q.enqueue('f')
      q.enqueue('e')
      q.enqueue('d')
      q.enqueue('c')
      q.enqueue('b')
      q.enqueue('a')

      assert(q.size() === 6)

      q.dequeue()
      q.dequeue()
      q.dequeue()
      q.dequeue()
      q.dequeue()
      q.dequeue()

      assert(q.isEmpty())
    })

    test('handles interleaved enqueue and dequeue operations', () => {
      q.enqueue('f')
      q.enqueue('e')
      q.enqueue('d')
      q.enqueue('c')

      assert(q.size() === 4)

      q.enqueue('b')
      q.dequeue()

      q.enqueue('a')
      q.dequeue()

      assert(q.size() === 4)
    })
  })

  describe('front', () => {
    test('returns the front element without removing it', () => {
      q.enqueue('f')
      q.enqueue('e')
      q.enqueue('d')
      q.enqueue('c')

      assert(q.front() === 'f')
      assert(q.size() === 4)
    })

    test('returns undefined if the queue is empty', () => {
      assert(q.front() === undefined)
    })

    test('does not modify the queue state', () => {
      q.enqueue('f')
      q.enqueue('e')
      q.enqueue('d')
      q.enqueue('c')

      q.front()

      assert(q.size() === 4)
      assert(q.rear() === 'c')
    })

    test('updates correctly after multiple enqueue and dequeue operations', () => {
      q.enqueue('f')
      q.enqueue('e')
      q.enqueue('d')
      q.enqueue('c')

      assert(q.front() === 'f')

      q.dequeue()
      assert(q.front() === 'e')

      q.dequeue()
      assert(q.front() === 'd')

      q.enqueue('b')
      assert(q.front() === 'd')
    })
  })

  describe('rear', () => {
    test('returns the last added element without removing it', () => {
      q.enqueue('f')
      q.enqueue('e')
      q.enqueue('d')
      q.enqueue('c')

      assert(q.rear() === 'c')
      assert(q.size() === 4)
    })

    test('returns undefined if the queue is empty', () => {
      assert(q.rear() === undefined)
    })

    test('does not modify the queue state', () => {
      q.enqueue('f')
      q.enqueue('e')
      q.enqueue('d')
      q.enqueue('c')

      q.rear()

      assert(q.size() === 4)
      assert(q.front() === 'f')
    })

    test('updates correctly after multiple enqueue and dequeue operations', () => {
      q.enqueue('f')
      q.enqueue('e')
      q.enqueue('d')
      q.enqueue('c')

      assert(q.rear() === 'c')

      q.enqueue('b')
      assert(q.rear() === 'b')

      q.dequeue()
      assert(q.rear() === 'b')

      q.enqueue('a')
      assert(q.rear() === 'a')
    })
  })

  describe('isEmpty', () => {
    test('returns true for a newly created queue', () => {
      assert(q.isEmpty())
    })

    test('returns false after an element is enqueued', () => {
      q.enqueue('a')

      assert(!q.isEmpty())
    })

    test('returns true after all elements are dequeued', () => {
      q.enqueue('a')
      q.enqueue('b')
      q.enqueue('c')

      assert(!q.isEmpty())

      q.dequeue()
      q.dequeue()
      q.dequeue()

      assert(q.isEmpty())
    })
  })

  describe('size', () => {
    test('returns 0 for a empty queue', () => {
      assert(q.size() === 0)
    })

    test('returns correct size after multiple enqueue operations', () => {
      q.enqueue('a')
      q.enqueue('b')
      q.enqueue('c')

      assert(q.size() === 3)
    })

    test('returns correct size after multiple enqueue and dequeue operations', () => {
      q.enqueue('a')
      q.enqueue('b')
      q.enqueue('c')
      q.enqueue('d')
      q.enqueue('e')

      assert(q.size() === 5)

      q.dequeue()
      q.dequeue()
      q.dequeue()

      assert(q.size() === 2)
    })

    test('returns 0 after all elements are dequeued', () => {
      q.enqueue('a')
      q.enqueue('b')
      q.enqueue('c')
      q.dequeue()
      q.dequeue()
      q.dequeue()

      assert(q.size() === 0)
    })

    test('does not go negative when dequeuing from an empty queue', () => {
      q.dequeue()

      assert(q.size() >= 0)
    })
  })
})

const queueImplementations: Array<QueueImplementation<string>> = [
  { q: new CircularQueue(10), limitedCapacity: 10 },
  { q: new QueueAsDynamicArray() },
  { q: new QueueAsLinkedList() },
  { q: new QueueAsStack() },
  { q: new QueueAsStaticArray(10), limitedCapacity: 10 }
]

queueImplementations.forEach(q => testQueue(q))

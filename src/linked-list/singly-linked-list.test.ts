import test, { describe } from 'node:test'
import assert from 'node:assert'
import { SinglyLinkedList, SinglyLinkedListNode } from './singly-linked-list.ts'
import { SinglyLinkedListContract } from './singly-linked-list.contract.ts'
import { SinglyLinkedListNodeWithDummyNode } from './singly-linked-list-with-dummy-node.ts'

const testSinglyLinkedList = (
  ll: SinglyLinkedListContract<any>
): any => describe('SinglyLinkedList', () => {
  test.beforeEach(() => {
    ll.clear()
  })

  describe('insertAt', () => {
    test('should insert a node at the beginning of the list when the list is empty', () => {
      ll.insertAt(0, 'a')

      assert.strictEqual(ll.at(0)!.value, 'a')
      assert.strictEqual(ll.size(), 1)
    })

    test('should insert a node at the beginning of the list when the list is not empty', () => {
      ll.insertAt(0, 'a')
      ll.insertAt(1, 'b')

      ll.insertAt(0, 'x')

      assert.strictEqual(ll.at(0)!.value, 'x')
      assert.strictEqual(ll.at(1)!.value, 'a')
      assert.strictEqual(ll.at(2)!.value, 'b')
      assert.strictEqual(ll.size(), 3)
    })

    test('should insert a node at any available position in the list', () => {
      ll.insertAt(0, 'A')
      ll.insertAt(1, 'B')
      ll.insertAt(1, 'C')

      assert.strictEqual(ll.at(0)!.value, 'A')
      assert.strictEqual(ll.at(1)!.value, 'C')
      assert.strictEqual(ll.at(2)!.value, 'B')
      assert.strictEqual(ll.size(), 3)
    })

    test('should insert a node at the end of the list when the position equals the current size.', async () => {
      ll.insertAt(0, 'A')
      ll.insertAt(1, 'B')
      ll.insertAt(2, 'C')

      const res = ll.insertAt(ll.size(), 'X')

      assert(res instanceof SinglyLinkedListNode)

      assert.strictEqual(ll.at(2)!.value, 'C')
      assert.strictEqual(ll.at(3)!.value, 'X')
      assert.strictEqual(ll.size(), 4)
    })

    test('should throw an error when the position is invalid.', () => {
      assert.throws(() => ll.insertAt(-1, 'A'), /Invalid Index/)
    })

    test('should throw an error when the position is greater than the current size of the list.', () => {
      ll.insertAt(0, 'a')
      ll.insertAt(1, 'b')

      assert.throws(() => ll.insertAt(3, 'c'), /Invalid Index/)
    })
  })

  describe('deleteAt', () => {
    test('should remove and return the node at position 0 in a list with a single element.', () => {
      ll.insertAt(0, 10)

      const removedNode = ll.removeAt(0)

      assert.strictEqual(removedNode!.value, 10)
      assert.strictEqual(ll.size(), 0)
    })

    test('should remove and return the node at position 0 in a list with multiple elements.', () => {
      ll.insertAt(0, 10)
      ll.insertAt(1, 20)
      ll.insertAt(2, 30)

      const deletedNode = ll.removeAt(0)

      assert.strictEqual(deletedNode!.value, 10)
      assert.strictEqual(ll.size(), 2)
      assert.strictEqual(ll.at(0)!.value, 20)
      assert.strictEqual(ll.at(1)!.value, 30)
    })

    test('should remove and return the node at a valid intermediate position.', () => {
      ll.insertAt(0, 10)
      ll.insertAt(1, 20)
      ll.insertAt(2, 30)
      ll.insertAt(3, 40)

      const deletedNode = ll.removeAt(2)

      assert.strictEqual(deletedNode!.value, 30)
      assert.strictEqual(ll.size(), 3)
      assert.strictEqual(ll.at(0)!.value, 10)
      assert.strictEqual(ll.at(1)!.value, 20)
      assert.strictEqual(ll.at(2)!.value, 40)
    })

    test('should remove and return the node at the last position.', () => {
      ll.insertAt(0, 10)
      ll.insertAt(1, 20)
      ll.insertAt(2, 30)

      const removed = ll.removeAt(2)

      assert.strictEqual(removed!.value, 30)
      assert.strictEqual(ll.size(), 2)
      assert.strictEqual(ll.at(0)!.value, 10)
      assert.strictEqual(ll.at(1)!.value, 20)
    })

    test('should throw an error if the position is less than 0.', () => {
      ll.insertAt(0, 10)

      assert.throws(() => ll.removeAt(-1), /Invalid Index/)
    })

    test('should throw an error if the position is greater than or equal to the list size.', () => {
      ll.insertAt(0, 10)

      assert.throws(() => ll.removeAt(1), /Invalid Index/)
    })
  })

  describe('at', () => {
    test('should return the node at position 0 if the list has at least one element.', () => {
      ll.insertAt(0, 'A')

      const result = ll.at(0)

      assert.strictEqual(result!.value, 'A')
    })

    test('should return the node at a valid intermediate position.', () => {
      ll.insertAt(0, 'C')
      ll.insertAt(0, 'B')
      ll.insertAt(0, 'A')

      const result = ll.at(1)

      assert.strictEqual(result!.value, 'B')
    })

    test('should return the node at the last position in the list.', () => {
      ll.insertAt(0, 'C')
      ll.insertAt(0, 'B')
      ll.insertAt(0, 'A')

      const result = ll.at(ll.size() - 1)

      assert.strictEqual(result!.value, 'C')
    })

    test('should throw an Error if the position is negative.', () => {
      assert.throws(() => ll.at(-1), /Invalid Index/)
    })

    test('should throw an error if the position is greater than or equal to the list size.', () => {
      assert.throws(() => ll.at(1), /Invalid Index/)

      ll.insertAt(0, 'B')
      ll.insertAt(0, 'A')

      assert.throws(() => ll.at(3), /Invalid Index/)
    })
  })

  describe('search', () => {
    test('should return the node if the value exists in the list.', () => {
      ll.insertAt(0, 'C')
      ll.insertAt(0, 'B')
      ll.insertAt(0, 'A')

      const result = ll.search('C')

      assert.strictEqual(result!.value, 'C')
    })

    test('should return `null` if the value does not exist in the list.', () => {
      ll.insertAt(0, 'C')
      ll.insertAt(0, 'B')
      ll.insertAt(0, 'A')

      const result = ll.search('X')

      assert.strictEqual(result, null)
    })

    test('should correctly handle searching in an empty list.', () => {
      assert.strictEqual(ll.search('A'), null)
    })
  })

  describe('traverse', () => {
    test('should return an empty array if the list is empty.', () => {
      assert.deepStrictEqual(ll.traverse(), [])
    })

    test('should return an array with a single element if the list has one node.', () => {
      ll.insertAt(0, 'a')
      assert.deepStrictEqual(ll.traverse(), ['a'])
    })

    test('should return an array with the values of all nodes in order when the list has multiple elements.', () => {
      ll.insertAt(0, 'd')
      ll.insertAt(0, 'c')
      ll.insertAt(0, 'b')
      ll.insertAt(0, 'a')

      assert.deepStrictEqual(ll.traverse(), ['a', 'b', 'c', 'd'])
    })
  })
})

;([
  new SinglyLinkedList(),
  new SinglyLinkedListNodeWithDummyNode()
] satisfies Array<SinglyLinkedListContract<any>>).forEach(testSinglyLinkedList)

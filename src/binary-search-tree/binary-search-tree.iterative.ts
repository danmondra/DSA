import assert from 'node:assert'
import { BinarySearchTreeContract, BinaryTreeNode } from './binary-search-tree.contract.js'
import { QueueAsLinkedList } from '../queue/queue-as-linked-list.js'

export class BinarySearchTree implements BinarySearchTreeContract {
  root: BinaryTreeNode | null

  constructor () {
    this.root = null
  }

  search (value: number): BinaryTreeNode | -1 {
    let currentNode: BinaryTreeNode | null = this.root

    while (currentNode !== null) {
      if (value === currentNode.value) return currentNode

      if (currentNode.value > value) {
        currentNode = currentNode.left
        continue
      }

      currentNode = currentNode.right
    }

    return -1
  }

  insert (value: number): void {
    if (this.root === null) {
      this.root = new BinaryTreeNode(value)
      return
    }

    let currentNode = this.root

    while (currentNode !== null) {
      if (currentNode.value === value)
        throw Error('Duplicated nodes not implemented')

      if (currentNode.value > value) {
        if (currentNode.left === null) {
          currentNode.left = new BinaryTreeNode(value)
          return
        }

        currentNode = currentNode.left
        continue
      }

      if (currentNode.right === null) {
        currentNode.right = new BinaryTreeNode(value)
        return
      }

      currentNode = currentNode.right
    }

    assert.fail(new Error('Shouldn\'t reach this point'))
  }

  remove (value: number): void {
    if (this.root === null) return

    let currentParent: BinaryTreeNode | null = null
    let current: BinaryTreeNode | null = this.root
    let currentSide: 'left' | 'right' | null = null

    while (current !== null) {
      if (value === current.value) break

      if (value < current.value) {
        currentParent = current
        currentSide = 'left'
        current = current.left
        continue
      }

      currentParent = current
      currentSide = 'right'
      current = current.right
    }

    // Not found or empty tree
    if (current === null)
      return

    const replaceNode = (replacement: BinaryTreeNode | null): void => {
      // Root is node to replace
      if (currentParent === null) {
        this.root = replacement
        return
      }

      currentParent[currentSide!] = replacement
    }

    // 1st case. Is leaf node
    if (current.left === null && current.right === null) {
      replaceNode(null)
      return
    }

    // 2nd case. Has a single node.
    if (current.left === null) {
      replaceNode(current.right)
      return
    }

    if (current.right === null) {
      replaceNode(current.left)
      return
    }

    // 3rd case. Has two nodes.
    let [parentMin, min] = [current, current.right]

    // Looking for successor
    while (min.left !== null)
      [parentMin, min] = [min, min.left]

    current.value = min.value

    // Removing successor
    if (parentMin.right === min)
      parentMin.right = null // min.left // TODO - the same as null
    else
      parentMin.left = null

    if (min.right) // parentMin.left could be right too as the previous
      parentMin.left = min.right
  }

  /*
  This approach uses a BFS-like algorithm
  using a queue to breadthly insert nodes.

  For the next ordered array:
  [1, 2, 3, 4, 5, 6, 7, 8, 9]
  length: 9
  The middlepoint is calculated as:
  Math.trunc((start + end) / 2)

  And the BST is built as:
  [{ n: 5, s: 0, e: 8 }]
  [{ n: 2, s: 0, e: 3 }, { n: 7, s: 5, e: 8 }]
  [{ n: 7, s: 5, e: 8 }, { n: 1, s: 0, e: 0 }, { n: 3, s: 2, e: 3 }]
  [{ n: 1, s: 0, e: 0 }, { n: 3, s: 2, e: 3 }, { n: 6, s: 5, e: 5 }, { n: 8, s: 7, e: 8 }]
  [{ n: 3, s: 2, e: 3 }, { n: 6, s: 5, e: 5 }, { n: 8, s: 7, e: 8 }]
  [{ n: 6, s: 5, e: 5 }, { n: 8, s: 7, e: 8 }, { n: 4, s: 3, e: 3 }]
  [{ n: 8, s: 7, e: 8 }, { n: 4, s: 3, e: 3 }]
  [{ n: 4, s: 3, e: 3 }, { n: 9, s: 8, e: 8 }]
  [{ n: 9, s: 8, e: 8 }]

               ____5____
              /         \
            2            7
           /  \        /   \
         1      3     6     8
        / \    / \   / \   / \
                 4            9
  */

  create (sortedArr: number[]): this {
    type NodeData = { node: BinaryTreeNode, start: number, end: number }
    const nodeData = (n: BinaryTreeNode, s: number, e: number): NodeData =>
      ({ node: n, start: s, end: e })

    const n = sortedArr.length
    if (n === 0) return this

    let mid = Math.trunc((n - 1) / 2)
    this.root = new BinaryTreeNode(sortedArr[mid])

    const q = new QueueAsLinkedList<NodeData>()
    q.enqueue(nodeData(this.root, 0, n - 1))

    while (!q.isEmpty()) {
      console.dir(q.toArray().map(obj => ({ n: obj.node.value, s: obj.start, e: obj.end })), { breakLength: 1000 })
      debugger
      const d = q.dequeue()!
      const { node, start, end } = d

      mid = Math.floor((start + end) / 2)

      if (mid > start) {
        const midLeft = Math.floor((start + (mid - 1)) / 2)
        node.left = new BinaryTreeNode(sortedArr[midLeft])
        q.enqueue(nodeData(node.left, start, mid - 1))
      }

      if (end > mid) {
        const midRight = Math.floor((mid + 1 + end) / 2)
        node.right = new BinaryTreeNode(sortedArr[midRight])
        q.enqueue(nodeData(node.right, mid + 1, end))
      }
    }

    return this
  }
}

const sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const bst = new BinarySearchTree().create(sortedArray)

console.dir(bst, { depth: Infinity })

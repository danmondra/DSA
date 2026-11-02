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
        if (currentNode.left === null) {
          currentNode.left = new BinaryTreeNode(value)
          break
        }

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
     (level order traversal)
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
        2           7
       /  \        /  \
      1     3     6     8
     / \   / \   / \   / \
        4                 9
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

  getLast (): number | undefined {
    let last = this.root
    if (last === null) return undefined

    while (last.right)
      last = last.right

    return last.value
  }

  /*
   *
   * Type of lines
   * 1. root ->
   *    - it requires padding spaces
   * 2. slashes ->
   *    - requires / before the previous half
   *    - requires \ before the previous half
   * 3. nodes ->
   *    - requires spaces between nodes
   *    - respect amount of digits
   *
   * Concerns
   * - Big trees (too separated leafs)
   * - Big digits
   *
   * Calculating the height of tree
   * #1 approach (balanced BST)
   * The formula log_2(arr.length) is used to calculate
   * the amount of levels in a BST. We use base 2
   * because we have left and right, that is two nodes.
   *
   * #2 approach (non-balanced BST)
   * We need to traverse the node to know the amount of
   * nodes. We can use a level order traversal. In each
   * recursive iteration we can make sure to
   *
   * Traversing and building the ASCII tree
   * We are going to use a depth first traversal
   *
   *
   * Testing
   *   2
   *  / \
   * 1   3
   *
   *       5
   *    /     \
   *   3       7
   *  / \     / \
   * 1   2   6   8

             _____5______
            /            \
           2              7
         /   \         /     \
         1      3     6      _8__
        / \    / \   / \    /    \
                  4               9
   * */
  logPretty (): void {
    if (this.root === null) {
      console.log('')
      return
    }

    const calculateHeight = (node: BinaryTreeNode | null): number => {
      if (node === null) return 0

      const leftResult = calculateHeight(node.left)
      const rightResult = calculateHeight(node.right)

      return Math.max(leftResult, rightResult) + 1
    }
    const treeHeight = calculateHeight(this.root)

    const lastNodeDigits = this.getLast()!.toString(10).length
    const calculateWidth = (): number => {
      const SPACE_SIZE = 3
      const lastLevelNodes = 2 ** (treeHeight - 1)

      const lastLevelWidth =
        (lastLevelNodes * lastNodeDigits) + // totalDigits
        ((lastLevelNodes / 2) * SPACE_SIZE) + // spaces between siblings
        (((lastLevelNodes / 2) - 1) * (SPACE_SIZE + 1)) // spaces between cousins
      // supposing:
      // -=empty digit (no node)
      // s=single space
      // arr = [1, 2, 3]
      //             | / \ |
      // last level: |2sss3|
      // width = 5
      //
      // arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      //             |                5               |
      //             |        /               \       |
      //             |       2                 7      | // 2 formula = (amountOfDigits + '/'.length) * (treeHeight - currentLevel)
      //             |   /      \          /      \   |
      //             |  1        3        6        8  | // 3
      //             | / \      / \      / \      / \ |
      // last level: |-sss-ssss-sss4ssss-sss-ssss-sss9| // 4
      // width = 32
      //
      // arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
      //             |  / \        / \        / \        / \        / \        / \        / \        / \  |
      // last level: |--sss--ssss--sss--ssss--sss--ssss--sss--ssss--sss--ssss--sss--ssss--sss--ssss--sss16|
      // width = 84

      return lastLevelWidth
    }
    const treeWidth = calculateWidth()

    const tree: string[] = []
    const createRoot = (): string => {
      const totalRootDigits = this.root!.value.toString(10).length
      console.log({ totalRootDigits, lastNodeDigits })
      assert(lastNodeDigits >= totalRootDigits)

      const text = this.root!.value.toString(10).padStart(lastNodeDigits, ' ')
      const start = Math.floor((treeWidth - lastNodeDigits) / 2)
      const spaces = ' '.repeat(start)

      tree.push(spaces + text + ' '.repeat(treeWidth - start - lastNodeDigits))

      return tree[0]
    }
    const root = createRoot()

    console.log(tree.join('\n'))
    console.log({ treeWidth, treeHeight, tree: tree.join('\n') })
  }
}

// 2³ = 2 x 2 x 2 = 8
// 2⁴ = 2 x 2 x 2 x 2 = 16

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
const bst = new BinarySearchTree()
  .create(arr)

bst.logPretty()
// console.dir(bst, { depth: Infinity })

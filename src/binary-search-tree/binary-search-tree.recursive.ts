import { BinarySearchTreeContract, BinaryTreeNode } from './binary-search-tree.contract.js'

export class BinarySearchTree implements BinarySearchTreeContract {
  root: BinaryTreeNode | null

  constructor () {
    this.root = null
  }

  search (
    value: number,
    currentNode: BinaryTreeNode | null = this.root
  ): BinaryTreeNode | -1 {
    if (currentNode === null) return -1

    if (currentNode.value === value) return currentNode

    if (currentNode.value > value) return this.search(value, currentNode.left)

    return this.search(value, currentNode.right)
  }

  private privateInsertNode (
    value: number,
    current: BinaryTreeNode
  ): void {
    if (value === current.value)
      throw Error('Duplicated nodes not implemented')

    if (value < current.value) {
      if (current.left !== null) {
        this.privateInsertNode(value, current.left)
        return
      }

      current.left = new BinaryTreeNode(value)
      return
    }

    if (current.right !== null) {
      this.privateInsertNode(value, current.right)
      return
    }

    current.right = new BinaryTreeNode(value)
  }

  insert (
    value: number
  ): void {
    if (this.root === null) {
      this.root = new BinaryTreeNode(value)

      return
    }

    this.privateInsertNode(value, this.root)
  }

  private min (
    root: BinaryTreeNode
  ): BinaryTreeNode {
    let min = root

    while (min.left !== null)
      min = min.left

    return min
  }

  // For recursivity we could either return always a node so the
  // parent can point to the correct swapped node, or return nothing
  // and just watch until we reach a leaf node.
  //
  private privateRemoveNode (
    valueToRemove: number,
    currentNode: BinaryTreeNode
  ): BinaryTreeNode | null {
    if (currentNode === null) return null

    if (valueToRemove < currentNode.value) {
      currentNode.left = this
        .privateRemoveNode(valueToRemove, currentNode.left!)
      return currentNode
    }

    if (valueToRemove > currentNode.value) {
      currentNode.right = this
        .privateRemoveNode(valueToRemove, currentNode.right!)
      return currentNode
    }

    // Case 1. is leaf node
    if (currentNode.left === null && currentNode.right === null)
      return null

    // Case 2. Is node with a single child
    if (currentNode.left === null) return currentNode.right
    if (currentNode.right === null) return currentNode.left

    // Case 3. Is node with two children (right and left)
    const successor = this.min(currentNode.right)

    currentNode.value = successor.value
    // This always going to be handled in the case 1 or 2.
    currentNode.right = this.privateRemoveNode(successor.value, currentNode.right)

    return currentNode
  }

  remove (valueToRemove: number): void {
    if (this.root === null) throw new Error('There\'s no node to remove')

    this.root = this.privateRemoveNode(valueToRemove, this.root)
  }

  /**

  For the next ordered array:
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  length: 12
  high: 12 - 1 = 11

  The middlepoint is calculated as:
  Math.ceil((high - low) / 2) + low

  And the BST is built as:
               ____7____
              /         \
             4          11
           /  \        /   \
         2      6     9     13
        / \    /     / \    /
       1   3  5     8  10  12

  And the recursive call stack would be:
  create(sortArr, low: 0, high: sortArr.length) -> left: 4 | right: 11
    [left call]create(sortArr, low: 0, high: middlePoint) -> left: 2 | right: 6
      [left call] -> left: 1 | right: 3
      ...
    [right call]create(sortArr, low: middlePoint, high: sortArr.length) -> left: 9 | right: 13
      ...

  Time and space complexity O(n)
  Because we iterate throught each node
  */
  create (
    sortedArray: number[],
    l?: number,
    h?: number
  ): BinarySearchTree | // Final function result
    BinaryTreeNode | // Recursive call
    null /* Recursive call (leaf path) */ {
    const low = l ?? 0
    const high = h ?? sortedArray.length - 1

    // There is no node to add
    if (low > high) return null

    const middleElement = Math.ceil((high - low) / 2) + low
    const isFirstCall = low === 0 && high === sortedArray.length - 1
    const current = isFirstCall
      ? this.root = new BinaryTreeNode(sortedArray[middleElement])
      : new BinaryTreeNode(sortedArray[middleElement])

    // Given the next order of conditions, when only one node remains
    // to be added, the node is always placed on the left side.
    //
    // assert(high >= low)

    current.left = this.create(sortedArray, low, middleElement - 1) as BinaryTreeNode
    current.right = this.create(sortedArray, middleElement + 1, high) as BinaryTreeNode

    // Final result
    if (current === this.root)
      return this

    return current
  }
}

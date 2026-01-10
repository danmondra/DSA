/**
 * This file contains an alternative implementation
 * to some methods, using different techniques.
 *
 */

import assert from 'assert'
import { BinarySearchTree } from './binary-search-tree.iterative.js'

class TreeNode<T = number> {
  value: T
  right: TreeNode<T> | null
  left: TreeNode<T> | null
  parent: TreeNode<T> | null

  constructor (value: T) {
    this.value = value
    this.right = null
    this.left = null
    this.parent = null
  }
}

/**
 * Uses an additional property "parent" to track the owner of
 * the current node, making easier to understand the required
 * changes and also to traverse the tree backward and forward.
 */
export function removeNode (
  bst: BinarySearchTree,
  node: TreeNode
): void {
  if (bst.root === null || node === null) return

  // Case A: Deleting a Leaf node
  if (node.left === null && node.right === null) {
    if (node.parent === null) {
      bst.root = null
      return
    }

    if (node.parent.left === node) {
      node.parent.left = null
      return
    }

    if (node.parent.right === node) {
      node.parent.right = null
      return
    }

    assert.fail('Not all cases were handled')
  }

  // Case B. Deleting a node with a single child.
  // if (node.left !== null || node.right !== null) {
  // The previous line is wrong because it is always
  // true. To fix it, we need to indicate that either
  // left or rigth must be exclusively different than
  // null. We can make use of Exclusive Or.
  if ((node.left !== null) !== (node.right !== null)) {
    const child = (node.left ?? node.right)

    if (node.parent === null) {
      bst.root = null
      return
    }

    if (node.parent.left === node) {
      node.parent.left = child
      return
    }

    if (node.parent.right === node) {
      node.parent.right = child
      return
    }

    assert.fail('Not all cases were handled')
  }

  // Case C. Deleting a node with two children.
  let successor = node.right!
  while (successor.left !== null)
    successor = successor.left
  removeNode(bst, successor)

  if (node.parent === null) {
    bst.root = successor
    return
  }

  if (node.parent.left === node) {
    node.parent.left = successor
    return
  }

  if (node.parent.right === node) {
    node.parent.right = successor
    return
  }
  successor.parent = node.parent

  successor.left = node.left
  node.left!.parent = successor

  successor.right = node.right
  if (node.right !== null)
    node.right.parent = successor
}

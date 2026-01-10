export class BinaryTreeNode<T = number> {
  value: T
  left: BinaryTreeNode<number> | null
  right: BinaryTreeNode<number> | null

  constructor (value: T) {
    this.value = value
    this.left = null
    this.right = null
  }
}

export abstract class BinarySearchTreeContract {
  abstract root: BinaryTreeNode | null

  abstract search: (value: number) => BinaryTreeNode | -1

  abstract insert: (value: number, node: BinaryTreeNode) => void

  abstract remove: (value: number) => void
}

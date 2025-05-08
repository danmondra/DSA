import { describe, test } from 'node:test'
import assert from 'node:assert'
import { binarySearch } from './binary-search.ts'

const testBinarySearch = (
  binarySearch: (a: number[], value: number) => number
): any => describe('Binary Search Function', () => {
  test('should find the target value in a sorted array', () => {
    const array = [1, 2, 3, 4, 5]
    const index = binarySearch(array, 3)

    assert.strictEqual(index, 2)
  })

  test('should return -1 if the target value is not present in the array', () => {
    const array = [1, 2, 4, 5]
    const index = binarySearch(array, 3)

    assert.strictEqual(index, -1)
  })

  test('should find the target when is the first element', () => {
    const array = [1, 2, 3, 4, 5]
    const index = binarySearch(array, 1)

    assert.strictEqual(index, 0)
  })

  test('should find the target when is the last element', () => {
    const array = [1, 2, 3, 4, 5]
    const index = binarySearch(array, 5)

    assert.strictEqual(index, 4)
  })

  test('should find the target when is the middle element', () => {
    const array = [1, 2, 3, 4, 5]
    const index = binarySearch(array, 3)

    assert.strictEqual(index, 2)
  })

  test('should handle an empty array by returning -1', () => {
    const array: number[] = []
    const index = binarySearch(array, 3)

    assert.strictEqual(index, -1)
  })

  test('should return "0" where the target is the only element of the array', () => {
    const array = [7]
    const index = binarySearch(array, 7)

    assert.strictEqual(index, 0)
  })

  test('should return a match if the array contains duplicate target values', () => {
    const array = [1, 2, 2, 2, 3, 4]
    const index = binarySearch(array, 2)

    assert(index >= 1 && index <= 3)
  })

  test('should return the correct index for negative numbers', () => {
    const array = [-5, -4, -3, -2, -1]
    const index = binarySearch(array, -3)

    assert.strictEqual(index, 2)
  })

  test('should return the correct index for floating point numbers', () => {
    const array = [0.1, 1.1, 2.2, 3.3, 4.4]
    const index = binarySearch(array, 3.3)
    assert.strictEqual(index, 3)
  })
})

testBinarySearch(binarySearch)

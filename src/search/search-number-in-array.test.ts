import assert from 'node:assert'
import test, { describe } from 'node:test'
import { linearSearch } from './linear-search.ts'

/**
 * @returns the index if found or -1 if not found
 */
type SearchFn = (a: number[], value: number) => number

const testSearchNumberInArray = (
  searchFn: SearchFn
): any => describe('Search Number in Array', () => {
  test.only('should return the correct index when the value is present at the beginning of the array', () => {
    const result = searchFn([3, 2, 5], 3)

    assert.strictEqual(result, 0)
  })

  test('should return the correct index when the value is present in the middle of the array', () => {
    const result = searchFn([3, 4, 6, 2, 5], 6)

    assert.strictEqual(result, 2)
  })

  test('should return the correct index when the value is present at the end of the array', () => {
    const result = searchFn([3, 4, 6, 2, 5], 5)

    assert.strictEqual(result, 4)
  })

  test('should return -1 when the value is not present in the array', () => {
    const result = searchFn([3, 4, 6, 2, 5], 9)

    assert.strictEqual(result, -1)
  })

  test('should return -1 when searching in an empty array', () => {
    const result = searchFn([], 0)

    assert.strictEqual(result, -1)
  })

  test('should return "0" whent the array contains only the searched value', () => {
    const result = searchFn([3], 3)

    assert.strictEqual(result, 0)
  })

  test('should return "-1" when the array doesn\'t contain the searched value', () => {
    const result = searchFn([3], 9)

    assert.strictEqual(result, -1)
  })

  test('should return the first match if the array contains duplicate values', () => {
    const result = searchFn([3, 4, 6, 4, 5], 4)

    assert.strictEqual(result, 1)
  })

  test('should correctly find negative numbers in the array', () => {
    const result = searchFn([1, 3, -5, 2, -1, 0], -5)

    assert.strictEqual(result, 2)
  })

  test('should correctly find zero in the array', () => {
    const result = searchFn([3, 4, 0, 2, 5], 0)

    assert.strictEqual(result, 2)
  })
})

testSearchNumberInArray(linearSearch)

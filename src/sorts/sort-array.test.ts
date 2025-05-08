import assert from 'node:assert'
import test, { describe } from 'node:test'
import { selectionSort } from './selection-sort.ts'
import { insertionSort } from './insertion-sort.ts'

export const testSortArray = (
  sortFn: (_a: any[]) => any
): any => describe('sort array', () => {
  const { name } = sortFn

  test(`${name} - should sort numbers in ascending order`, () => {
    const input = [5, 3, 8, 1, 2]
    const expected = [1, 2, 3, 5, 8]

    const result = sortFn([...input])

    assert.deepStrictEqual(result, expected)
  })

  test(`${name} - should handle empty array`, () => {
    assert.deepStrictEqual(sortFn([]), [])
  })

  test(`${name} - should handle already sorted array`, () => {
    const input = [1, 2, 3, 4, 5]

    assert.deepStrictEqual(sortFn([...input]), input)
  })

  test(`${name} - should handle array with duplicates`, () => {
    const input = [4, 2, 2, 5, 3]

    const expected = [2, 2, 3, 4, 5]
    assert.deepStrictEqual(sortFn([...input]), expected)
  })

  test(`${name} - should not mutate original array`, () => {
    const input = [3, 1, 2]

    const copy = [...input]
    sortFn(input)
    assert.deepStrictEqual(input, copy)
  })
})

;([selectionSort, insertionSort]).forEach(sortFn => testSortArray(sortFn))

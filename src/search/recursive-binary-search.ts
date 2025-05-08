export function recursiveBinarySearch (
  list: number[],
  valueToFind: number,
  positions?: { indexLow: number, indexHigh: number }
): number | null {
  const { indexLow = 0, indexHigh = list.length - 1 } = positions ?? {}
  const midpoint = Math.floor((indexHigh - indexLow) / 2) + indexLow

  if (indexLow > indexHigh) return null
  if (valueToFind === list[midpoint]) return midpoint

  if (list[midpoint] > valueToFind)
    return recursiveBinarySearch(list, valueToFind, { indexLow, indexHigh: midpoint - 1 })

  return recursiveBinarySearch(list, valueToFind, { indexLow: midpoint + 1, indexHigh })
}

export function binarySearch (
  list: number[],
  valueToFind: number
): number {
  let indexLow = 0
  let indexHigh = list.length - 1

  if (valueToFind > list[indexHigh] || valueToFind < list[indexLow])
    return -1

  while (indexHigh >= indexLow) {
    const midpoint = Math.floor((indexHigh - indexLow) / 2) + indexLow // 7

    if (valueToFind === list[midpoint]) return midpoint

    if (list[midpoint] > valueToFind) {
      indexHigh = midpoint - 1
      continue
    }

    indexLow = midpoint + 1
  }

  return -1
}

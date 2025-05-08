export function insertionSort (arr: number[]): number[] {
  const ordered = Array.from(arr)

  for (let i = 1; i < ordered.length; i++) {
    const current = arr[i]
    let left = i - 1

    for (left; left >= 0 && ordered[left] > current; left--)
      ordered[left + 1] = ordered[left]

    ordered[left + 1] = current
  }

  return ordered
}

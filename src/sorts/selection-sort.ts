export function selectionSort (arr: number[]): number[] {
  const ordered = Array.from(arr)

  for (let i = 0; i < ordered.length - 1; i++) {
    let lowest = i

    for (let j = i + 1; j < ordered.length; j++)
      if (ordered[j] < ordered[lowest]) lowest = j

    ;[ordered[i], ordered[lowest]] = [ordered[lowest], ordered[i]]
  }

  return ordered
}

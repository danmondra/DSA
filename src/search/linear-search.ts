export function linearSearch (list: number[], valueToFind: number): number {
  for (let i = 0; i < list.length; i++) {
    if (list[i] === valueToFind)
      return i
  }

  return -1
}

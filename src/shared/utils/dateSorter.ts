type DateSorterArgs = {
  a: null | string
  b: null | string
  sortType: 'asc' | 'desc'
}

export const dateSorter = ({ a, b, sortType }: DateSorterArgs) => {
  const endDateA = a ? new Date(a).getTime() : 0
  const endDateB = b ? new Date(b).getTime() : 0

  switch (sortType) {
    case 'asc':
      return endDateA - endDateB
    case 'desc':
      return endDateB - endDateA
    default:
      throw new Error(`Unknown sorter type "${sortType}"`)
  }
}

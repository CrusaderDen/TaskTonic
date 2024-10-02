//server date format - '2024-10-01T15:29:53.815+03:00'
export const dateFormatter = (date: null | string) => {
  if (date == null) {
    return ''
  }
  const shortMonth = ['янв', 'февр', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'нояб', 'дек']
  const datePart = date.split('T')[0]

  const month = +datePart.split('-')[1]
  const day = +datePart.split('-')[2]

  return `${day} ${shortMonth[month - 1]}`
}

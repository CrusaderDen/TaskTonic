export const generateDatesForNextMonth = () => {
  const dates = []
  const today = new Date()
  const month = today.getMonth()
  const year = today.getFullYear()

  for (let i = 0; i < 30; i++) {
    dates.push(new Date(year, month, today.getDate() + i).toISOString().split('T')[0])
  }

  return dates
}

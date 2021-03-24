/* eslint-disable padded-blocks */
class Helpers {

  /**
     * @desc Method for checking if the item time is available within time parameters
     * @return bool - success or failure
     * @param itemTime
     * @param payload
     */
  static skipIterationForItems(itemTime, payload) {
    if (payload.month !== '' && payload.year !== '') {
      const firstDay = new Date(payload.year, parseInt(payload.month.id), 1)
      const lastDay = new Date(payload.year, parseInt(payload.month.id) + 1, 0)
      lastDay.setHours(23, 59, 59)

      return !(itemTime >= firstDay && itemTime <= lastDay)
    } else {
      return false
    }
  }

  static formatCurrency(value) {
    return parseFloat(value).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })
  }
}

export default Helpers

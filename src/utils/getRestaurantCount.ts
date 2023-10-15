import type { JSDOM } from 'jsdom'

const getRestaurantCount = (dom: JSDOM): number => {
  const countDom = dom.window.document.body.querySelector('.c-page-count')
  if (countDom === null) {
    throw new Error('.c-page-count is not found')
  }
  const countNums = Array.from(countDom.querySelectorAll('.c-page-count__num'))
  if (countNums.length === 0) {
    throw new Error('.c-page-count__num is not found')
  }
  const count = countNums[2].textContent
  if (count === null) {
    throw new Error('count is not found')
  }
  const countNum = Number(count)
  if (Number.isNaN(countNum)) {
    return 0
  }
  return countNum
}

export default getRestaurantCount

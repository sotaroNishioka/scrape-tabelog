import { type JSDOM } from 'jsdom'

export const getRestaurantCount = (dom: JSDOM): number => {
  const countArea = dom.window.document.body.querySelector('.c-page-count')
  if (countArea === null) {
    return 0
  }
  const countWrap = Array.from(countArea.querySelectorAll('.c-page-count__num'))
  if (countWrap.length === 0) {
    return 0
  }
  const countText = countWrap[countWrap.length - 1].getElementsByTagName('strong')[0].textContent
  if (countText === null) {
    return 0
  }
  const countNum = Number(countText.replace(/,/g, ''))
  if (Number.isNaN(countNum)) {
    return 0
  }
  const result = Number(countNum)
  // resultが数値型かつNaNでないことをチェックする
  if (typeof result === 'number' && !Number.isNaN(result)) {
    return result
  }
  return 0
}

import { type JSDOM } from 'jsdom'

// prefectureのDomからレストラン件数を取得する
export const countPrefectureRestaurant = (dom: JSDOM): number => {
  const countArea = dom.window.document.body.querySelector('.list-controll')
  if (countArea === null) {
    return 0
  }
  const countWrap = countArea.querySelector('.c-page-count')
  if (countWrap === null) {
    return 0
  }
  const countItems = Array.from(countWrap.querySelectorAll('.c-page-count__num'))
  if (countItems.length === 0) {
    return 0
  }
  const countText = countItems[countItems.length - 1].getElementsByTagName('strong')[0].textContent
  if (countText === null) {
    return 0
  }
  const countNum = Number(countText.replace(/,/g, ''))
  if (Number.isNaN(countNum)) {
    return 0
  }
  return countNum
}

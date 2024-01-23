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

export const getRestaurantUrls = (dom: JSDOM): string[] => {
  const rstList = Array.from(dom.window.document.body.querySelectorAll('.rstlist-info'))[0]
  const restaurantUrls = Array.from(rstList.querySelectorAll('.cpy-rst-name'))
    .map((element) => {
      const anchor = element as HTMLAnchorElement
      return anchor.href
    })
  return restaurantUrls
}

export const getRestaurantDetail = (dom: JSDOM): { name: string, address: string, tel: string, opentime: string, holiday: string, budget: string, lunch: string, creditCard: string, eMoney: string, urlMobile: string, latitude: string, longitude: string } => {
  const name = dom.window.document.body.querySelector('.rstinfo-table__name-wrap')?.querySelector('span')?.textContent
  const tel = dom.window.document.body.querySelector('.rstinfo-table__tel-num')?.textContent
  const address = dom.window.document.body.querySelector('.rstinfo-table__address')?.textContent
  const rate = dom.window.document.body.querySelector('.rdheader-rating__score-val-dtl')?.textContent
  const reviewCount = dom.window.document.body.querySelector('.rdheader-rating__review-target')?.querySelector('.num')?.textContent
  const opentime = dom.window.document.body.querySelector('.rstinfo-table__table')?.querySelectorAll('tr')[0]?.querySelectorAll('td')[1]?.textContent
  const holiday = dom.window.document.body.querySelector('.rstinfo-table__table')?.querySelectorAll('tr')[1]?.querySelectorAll('td')[1]?.textContent
  const budget = dom.window.document.body.querySelector('.c-table.c-table--form rstinfo-table__table')?.querySelectorAll('tr')[0]?.querySelectorAll('td')[1]?.textContent
  const lunch = dom.window.document.body.querySelector('.c-table.c-table--form rstinfo-table__table')?.querySelectorAll('tr')[1]?.querySelectorAll('td')[1]?.textContent
  const creditCard = dom.window.document.body.querySelector('.c-table.c-table--form rstinfo-table__table')?.querySelectorAll('tr')[2]?.querySelectorAll('td')[1]?.textContent
  const eMoney = dom.window.document.body.querySelector('.c-table.c-table--form rstinfo-table__table')?.querySelectorAll('tr')[3]?.querySelectorAll('td')[1]?.textContent
  const urlMobile = dom.window.document.body.querySelector('.rstinfo-table__tel-area')?.querySelector('a')?.href
  const latitude = dom.window.document.body.querySelector('#js-map-latitude')?.getAttribute('value')
  const longitude = dom.window.document.body.querySelector('#js-map-longitude')?.getAttribute('value')
  const result = {
    name: name ?? '',
    address: address ?? '',
    tel: tel ?? '',
    rate: rate ?? '',
    reviewCount: reviewCount ?? '',
    opentime: opentime ?? '',
    holiday: holiday ?? '',
    budget: budget ?? '',
    lunch: lunch ?? '',
    creditCard: creditCard ?? '',
    eMoney: eMoney ?? '',
    urlMobile: urlMobile ?? '',
    latitude: latitude ?? '',
    longitude: longitude ?? ''
  }
  return result
}

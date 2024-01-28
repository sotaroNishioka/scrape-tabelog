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

const getCategoryCodes = (dom: JSDOM): string[] | null => {
  const genreItem = Array.from(dom.window.document.body.querySelectorAll('.rdheader-subinfo__item')).find((element) => {
    const title = element.querySelector('.rdheader-subinfo__item-title')?.textContent
    return (title != null) && title.includes('ジャンル')
  })
  if (genreItem === undefined) {
    return null
  }
  const result = Array.from(genreItem.querySelectorAll('.linktree__parent-target')).map((element) => {
    const anchor = element as HTMLAnchorElement
    const splited = anchor.href.split('/')
    return splited[splited.length - 2]
  })
  return result
}

const getBuget = (dom: JSDOM): { lunch: { min: number, max: number } | null, dinner: { min: number, max: number } | null } | null => {
  const budgetItem = Array.from(dom.window.document.body.querySelectorAll('.rdheader-subinfo__item')).find((element) => {
    const title = element.querySelector('.rdheader-subinfo__item-title')?.textContent
    return (title != null) && title.includes('予算')
  })
  if (budgetItem === undefined) {
    return null
  }
  const budgets = Array.from(budgetItem.querySelectorAll('.rdheader-budget__price-target'))
  const lunch = budgets[0].textContent
  const dinner = budgets[1].textContent
  const lunchRange = lunch === '-' || lunch === null ? null : lunch.split('～')
  const dinnerRange = dinner === '-' || dinner === null ? null : dinner.split('～')
  const result = {
    lunch: lunchRange === null
      ? null
      : {
          min: isNaN(Number(lunchRange?.[0]?.replace(/[^0-9]/g, ''))) ? 0 : Number(lunchRange?.[0]?.replace(/[^0-9]/g, '')),
          max: isNaN(Number(lunchRange?.[1]?.replace(/[^0-9]/g, ''))) ? 0 : Number(lunchRange?.[1]?.replace(/[^0-9]/g, ''))
        },
    dinner: dinnerRange === null
      ? null
      : {
          min: isNaN(Number(dinnerRange?.[0]?.replace(/[^0-9]/g, ''))) ? 0 : Number(dinnerRange?.[0]?.replace(/[^0-9]/g, '')),
          max: isNaN(Number(dinnerRange?.[1]?.replace(/[^0-9]/g, ''))) ? 0 : Number(dinnerRange?.[1]?.replace(/[^0-9]/g, ''))
        }
  }
  return result
}

const getStationCode = (dom: JSDOM): string | null => {
  const stationItem = Array.from(dom.window.document.body.querySelectorAll('.rdheader-subinfo__item')).find((element) => {
    const title = element.querySelector('.rdheader-subinfo__item-title')?.textContent
    return (title != null) && title.includes('最寄り駅')
  })
  if (stationItem === undefined) {
    return null
  }
  const stationContent = stationItem.querySelector('.rdheader-subinfo__item-text')
  const stationHref = stationContent?.querySelector('a')?.href?.split('/')
  const stationCode = stationHref?.[stationHref.length - 3]
  return stationCode ?? null
}

const convertTableItems = (dom: JSDOM): Array<{ title: string, dom: Element | null }> => {
  const tables = dom.window.document.body.querySelectorAll('.rstinfo-table__table')
  const tableItems = Array.from(tables).map((table) => {
    const rows = Array.from(table.querySelectorAll('tr'))
    const res = rows.map((row) => {
      const title = row.querySelector('th')?.textContent ?? ''
      const dom = row.querySelector('td')
      return { title, dom }
    })
    return res.flat()
  })
  return tableItems.flat()
}

interface RestaurantDetail {
  url: string
  prefectureCode: string
  areaCode: string
  cityCode: string
  restaurantCode: string
  stationCode: string | null
  name: string | null
  address: string | null
  mapImageUrl: string | null
  tel: string | null
  rate: number | null
  review: number | null
  bookMark: number | null
  photoCount: number | null
  isAbleReserve: boolean
  budget: { lunch: { min: number, max: number } | null, dinner: { min: number, max: number } | null } | null
  categoryCodes: string[] | null
  transportation: string | null
  openingHours: string | null
  holiday: string | null
  tax: string | null
  seat: number | null
  smoking: string | null
  parking: string | null
  child: string | null
  note: string | null
  homepage: string | null
}

export const getRestaurantDetail = (dom: JSDOM, url: string): RestaurantDetail => {
  // 基本情報
  const prefectureCode = url.split('/')[3]
  const areaCode = url.split('/')[4]
  const cityCode = url.split('/')[5]
  const restaurantCode = url.split('/')[6]
  const stationCode = getStationCode(dom)
  const name = dom.window.document.body.querySelector('.rstinfo-table__name-wrap')?.querySelector('span')?.textContent
  const tel = dom.window.document.body.querySelector('.rstinfo-table__tel-num')?.textContent
  const address = dom.window.document.body.querySelector('.rstinfo-table__address')?.textContent
  const rate = dom.window.document.body.querySelector('.rdheader-rating__score-val-dtl')?.textContent
  const review = dom.window.document.body.querySelector('.rdheader-rating__review-target')?.querySelector('.num')?.textContent
  const bookMark = dom.window.document.body.querySelector('.rdheader-rating__hozon-target')?.querySelector('.num')?.textContent
  const photoCount = dom.window.document.body.querySelector('#rdnavi-photo')?.querySelector('.rstdtl-navi__total-count')?.querySelector('strong')?.textContent
  const isAbleReserve = dom.window.document.body.querySelector('.rstinfo-table__reserve-status')?.textContent === '予約可'
  const categoryCodes = getCategoryCodes(dom)
  const budget = getBuget(dom)
  const mapImageUrl = dom.window.document.body.querySelector('.rstinfo-table__map-image')?.getAttribute('data-original')

  // その他情報
  const tableItems = convertTableItems(dom)
  const transportation = tableItems.find((item) => item.title === '交通手段')?.dom?.textContent
  const openingHours = tableItems.find((item) => item.title === '営業時間')?.dom?.querySelectorAll('.rstinfo-table__subject-text')[0]?.textContent
  const holiday = tableItems.find((item) => item.title === '営業時間')?.dom?.querySelectorAll('.rstinfo-table__subject-text')[1]?.textContent
  const tax = tableItems.find((item) => item.title === 'サービス料・チャージ')?.dom?.textContent
  const seat = tableItems.find((item) => item.title === '席数')?.dom?.querySelectorAll('p')[0]?.textContent?.replace(/席/g, '')
  const smoking = tableItems.find((item) => item.title === '禁煙・喫煙')?.dom?.textContent
  const parking = tableItems.find((item) => item.title === '駐車場')?.dom?.textContent
  const child = tableItems.find((item) => item.title === 'お子様連れ')?.dom?.textContent
  const note = tableItems.find((item) => item.title === '備考')?.dom?.textContent
  const homepage = tableItems.find((item) => item.title === 'ホームページ')?.dom?.querySelector('a')?.href

  const result = {
    url,
    prefectureCode,
    areaCode,
    cityCode,
    stationCode,
    restaurantCode,
    name: name ?? null,
    address: address ?? null,
    mapImageUrl: mapImageUrl ?? null,
    tel: tel ?? null,
    rate: isNaN(Number(rate)) ? null : Number(rate),
    review: isNaN(Number(review)) ? null : Number(review),
    bookMark: isNaN(Number(bookMark)) ? null : Number(bookMark),
    photoCount: isNaN(Number(photoCount)) ? null : Number(photoCount),
    isAbleReserve,
    budget,
    categoryCodes,
    transportation: transportation ?? null,
    openingHours: openingHours ?? null,
    holiday: holiday ?? null,
    tax: tax ?? null,
    seat: isNaN(Number(seat)) ? null : Number(seat),
    smoking: smoking ?? null,
    parking: parking ?? null,
    child: child ?? null,
    note: note ?? null,
    homepage: homepage ?? null
  }
  return result
}

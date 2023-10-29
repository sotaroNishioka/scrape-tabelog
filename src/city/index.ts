import { type JSDOM } from 'jsdom'
import { connect } from '../db'
import { type AreaDb, type City } from '../types'
import { getAreaDom, getAreas } from '../area'

const getDetails = (arg: { dom: JSDOM, area: AreaDb }): City[] => {
  const { dom, area } = arg
  // エリアから探すのタブを取得
  const tab = dom.window.document.body.querySelector('#tabs-panel-balloon-pref-area')
  if (tab === null) {
    const sublist = dom.window.document.body.querySelectorAll('.list-balloon__sub-list')
    const items = Array.from(sublist).map((sub) => {
      const linkItem = sub.querySelectorAll('.list-balloon__sub-list-item')
      if (linkItem === null) {
        throw new Error('.list-balloon__sub-list-item is not found')
      }
      return Array.from(linkItem)
    }).flat()
    const res = getLinkVal(items, area)
    return res
  }
  // エリアから探すの要素取得
  const cities = tab.querySelector('.list-balloon__list')
  if (cities === null) {
    throw new Error('.list-balloon__list is not found')
  }
  // エリアから探すのカラムをすべて取得
  const cols = cities.querySelectorAll('.list-balloon__list-col')
  if (cols === null) {
    throw new Error('.list-balloon__list-col is not found')
  }
  const items = Array.from(cols).map((col) => {
    const linkItem = col.querySelectorAll('.list-balloon__list-item')
    if (linkItem === null) {
      throw new Error('.list-balloon__list-item is not found')
    }
    return Array.from(linkItem)
  }).flat()
  const res = getLinkVal(items, area)
  return res
}

// リンク要素からリンク、名称などを取得する
const getLinkVal = (linkContents: Element[], area: AreaDb): City[] => {
  // カラムからリンクの親要素を取得
  const res = linkContents.map((link): City | undefined => {
    // dom要素を取得
    const aDom = link.querySelector('.c-link-arrow')
    if (aDom === null) {
      throw new Error('.c-link-arrow is not found')
    }
    // リンクのURLを取得
    const hrefVal = aDom.getAttribute('href') === null ? '' : aDom.getAttribute('href')
    if (hrefVal === null) {
      throw new Error('hrefVal is not found')
    }
    // リンクのコードを取得
    const code = hrefVal.split('/')[5]
    const nameDom = aDom.querySelector('span')
    if (nameDom === null) {
      // eslint-disable-next-line array-callback-return
      return
    }
    // リンクの名前を取得
    const nameVal = nameDom?.textContent === null ? '' : nameDom.textContent
    const obj = {
      name: nameVal,
      url: hrefVal,
      code,
      prefectureId: area.prefecture_id,
      areaId: area.id
    }
    return obj
  })
  const filtered = res.filter((x) => x !== undefined) as City[]
  return filtered
}

const insertCitiesAsync = async (details: City[]): Promise<void> => {
  const client = await connect()
  try {
    const values = details.map((detail) => {
      return `('${detail.name}', '${detail.url}', '${detail.code}', '${detail.prefectureId}', '${detail.areaId}')`
    }).join(',')
    await client.query(`
      INSERT INTO 
        city(name, url, code, prefecture_id, area_id)
        VALUES ${values}
        ON CONFLICT (url) DO NOTHING
      `)
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

const insertAreaCount = async (arg: { count: number, id: string }): Promise<void> => {
  const client = await connect()
  try {
    await client.query(`
      UPDATE area
      SET restaurant_count = ${arg.count}
      WHERE id = '${arg.id}'
      `)
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

const countAreaRestaurant = (dom: JSDOM): number => {
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

export const asyncUpdateCities = async (): Promise<void> => {
  console.log('start asyncUpdateCities')
  const areas = await getAreas()

  for (const [index, area] of Object.entries(areas)) {
    const dom = await getAreaDom(area)
    const count = countAreaRestaurant(dom)
    const details = getDetails({ dom, area })

    await Promise.all([
      insertAreaCount({ count, id: area.id }),
      insertCitiesAsync(details)
    ])

    console.log(`insertCitiesCount index = ${index} is done`)
    console.log(`${area.name} has ${count} restaurants`)
    console.log(`${area.name} has ${details.length} cities`)
  }
}

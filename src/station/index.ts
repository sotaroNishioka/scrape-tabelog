import { type JSDOM } from 'jsdom'
import { connect } from '../db'
import { type CityDb, type Station, type City } from '../types'
import { getCities, getCityDom } from '../city'
// import fetch from 'node-fetch'

const getDetails = (arg: { dom: JSDOM, city: CityDb }): Station[] => {
  const { dom, city } = arg
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
    const res = getLinkVal(items, city)
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
  const res = getLinkVal(items, city)
  return res
}

// リンク要素からリンク、名称などを取得する
const getLinkVal = (linkContents: Element[], city: CityDb): Station[] => {
  // カラムからリンクの親要素を取得
  const res = linkContents.map((link): City | null => {
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
    const code = hrefVal.split('/')[6]
    if (code === '') {
      return null
    }
    const nameDom = aDom.querySelector('span')
    if (nameDom === null) {
      return null
    }
    // リンクの名前を取得
    const nameVal = nameDom?.textContent === null ? '' : nameDom.textContent
    const obj = {
      name: nameVal,
      url: hrefVal,
      code,
      prefectureId: city.prefecture_id,
      areaId: city.area_id,
      cityId: city.id
    }
    return obj
  })
  const filtered = res.filter((x) => x !== null) as Station[]
  return filtered
}

const insertStationsAsync = async (details: Station[]): Promise<void> => {
  const client = await connect()
  try {
    const values = details.map((detail) => {
      if (detail.code === '') {
        console.log(detail)
      }
      return `('${detail.name}', '${detail.url}', '${detail.code}', '${detail.prefectureId}', '${detail.areaId}', '${detail.cityId}')`
    }).join(',')
    if (values.length === 0) {
      return
    }
    await client.query(`
      INSERT INTO
        station(name, url, code, prefecture_id, area_id, city_id)
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

const insertCityCount = async (arg: { count: number, id: string }): Promise<void> => {
  const client = await connect()
  try {
    await client.query(`
      UPDATE city
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

const countCityRestaurant = (dom: JSDOM): number => {
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

export const asyncUpdateStations = async (): Promise<void> => {
  console.log('start asyncUpdateStations')
  const cities = await getCities()

  for (let i = 0; i < cities.length; i += 10) {
    const targets = cities.slice(i, i + 10)
    const res = targets.map(async (x, index) => {
      const dom = await getCityDom(x)
      const count = countCityRestaurant(dom)
      const details = getDetails({ dom, city: x })
      await Promise.all([
        insertCityCount({ count, id: x.id }),
        insertStationsAsync(details)
      ])
      console.log(`insertCityCount index = ${index + i} is done`)
      console.log(`${x.name} has ${count} restaurants`)
      console.log(`${x.name} has ${details.length} areas`)
    })
    await Promise.all(res)
  }
}

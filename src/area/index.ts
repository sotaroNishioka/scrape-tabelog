import { JSDOM } from 'jsdom'
import { type AreaDb, type Area } from '../types'
import { getPrefectures, getPrefecturesDom } from '../prefecture'
import { connect } from '../db'
import fetch from 'node-fetch'

const getDetails = (prefecture: { id: string, dom: JSDOM }): Area[] => {
  const { id, dom } = prefecture
  // タブ取得
  const tab = dom.window.document.body.querySelector('#tabs-panel-balloon-pref-area')
  if (tab === null) {
    throw new Error('#tabs-panel-balloon-pref-area is not found')
  }
  // エリアから探すの一覧要素取得
  const cities = tab.querySelector('.list-balloon__list')
  if (cities === null) {
    throw new Error('.list-balloon__list is not found')
  }
  // エリアから探すのカラムをすべて取得
  const cols = cities.querySelectorAll('.list-balloon__list-col')
  if (cols === null) {
    throw new Error('.list-balloon__list-col is not found')
  }
  // リンクの親要素を取得
  const items = Array.from(cols).map((col) => {
    const linkItem = col.querySelectorAll('.list-balloon__list-item')
    if (linkItem === null) {
      throw new Error('.list-balloon__list-item is not found')
    }
    return Array.from(linkItem)
  }).flat()
  const res = items.map((link) => {
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
    const code = hrefVal.split('/')[4]
    // リンクの名前を取得
    const nameDom = aDom.querySelector('span')
    if (nameDom === null) {
      throw new Error('nameDom is not found')
    }
    const nameVal = nameDom?.textContent === null ? '' : nameDom.textContent
    const obj = {
      name: nameVal,
      url: hrefVal,
      code,
      prefectureId: id
    }
    return obj
  })
  return res
}

const insertAreasAsync = async (details: Area[]): Promise<void> => {
  const client = await connect()
  try {
    const values = details.map((detail) => {
      return `('${detail.name}', '${detail.url}', '${detail.code}', '${detail.prefectureId}')`
    }).join(',')
    await client.query(`
      INSERT INTO 
        area(name, url, code, prefecture_id)
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

const insertPrefectureCount = async (arg: { count: number, id: string }): Promise<void> => {
  const client = await connect()
  try {
    await client.query(`
      UPDATE prefecture
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

const countPrefectureRestaurant = (dom: JSDOM): number => {
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

export const asyncUpdateAreas = async (): Promise<void> => {
  console.log('start asyncUpdateAreas')
  const prefectures = await getPrefectures()

  for (const [index, prefecture] of Object.entries(prefectures)) {
    const dom = await getPrefecturesDom(prefecture.roma)
    const count = countPrefectureRestaurant(dom)
    const details = getDetails({ dom, id: prefecture.id })

    await Promise.all([
      insertAreasAsync(details),
      insertPrefectureCount({ count, id: prefecture.id })
    ])
    console.log(`insertAreaCount index = ${index} is done`)
    console.log(`${prefecture.yomi} has ${count} restaurants`)
    console.log(`${prefecture.yomi} has ${details.length} areas`)
  }
}

export const getAreas = async (): Promise<AreaDb[]> => {
  const client = await connect()
  try {
    const sql = process.env.PREFECTURE === undefined
      ? 'SELECT id, name, url, code, prefecture_id FROM area'
      : `SELECT id, name, url, code, prefecture_id FROM area WHERE prefecture_id = '${process.env.PREFECTURE}'`
    const { rows } = await client.query(sql) as { rows: AreaDb[] }
    return rows
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

// 都道府県ページの取得
export const getAreaDom = async (area: AreaDb): Promise<JSDOM> => {
  // ページ取得
  let response
  try {
    response = await fetch(area.url)
  } catch (err) {
    console.error(err)
    throw new Error('area fetch error')
  }
  const body = await response.text()
  const dom = new JSDOM(body)
  return dom
}

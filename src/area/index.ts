import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
import { connect } from '../db'
import { type Area, type Prefecture } from '../types'

// 都道府県ページの取得
const getDomsAsync = async (prefecture: Prefecture): Promise<JSDOM> => {
  // ページ取得
  let response
  try {
    response = await fetch(`https://tabelog.com/${prefecture.roma}/`)
  } catch (err) {
    console.error(err)
  }
  const body = await response.text()
  const dom = new JSDOM(body)
  return dom
}

const getLinkContents = (dom: JSDOM): Element[] => {
  const tab = dom.window.document.body.querySelector('#tabs-panel-balloon-pref-area')
  if (tab === null) {
    throw new Error('#tabs-panel-balloon-pref-area is not found')
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
  })
  const res = items.flat()
  return res
}

const getDetails = (linkContents: Element[], prefecture: Prefecture): Area[] => {
  const res = linkContents.map((link) => {
    const aDom = link.querySelector('.c-link-arrow')
    if (aDom === null) {
      throw new Error('.c-link-arrow is not found')
    }
    const hrefVal = aDom.getAttribute('href') === null ? '' : aDom.getAttribute('href')
    if (hrefVal === null) {
      throw new Error('hrefVal is not found')
    }
    const code = hrefVal.split('/')[4]
    const nameDom = aDom.querySelector('span')
    if (nameDom === null) {
      throw new Error('nameDom is not found')
    }
    const nameVal = nameDom?.textContent === null ? '' : nameDom.textContent
    const obj = {
      name: nameVal,
      url: hrefVal,
      code,
      prefectureId: prefecture.id
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

const getAreasAsync = async (prefectures: Prefecture[]): Promise<Area[]> => {
  const detailsRaw = prefectures.map(async (prefecture) => {
    const dom = await getDomsAsync(prefecture)
    const linkContents = getLinkContents(dom)
    const details = getDetails(linkContents, prefecture)
    return details
  })
  const details = (await Promise.all(detailsRaw)).flat()
  await insertAreasAsync(details)
  return details
}

export default getAreasAsync

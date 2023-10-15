import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
import { connect } from '../db'
import { type AreaDb, type City } from '../types'

const getAreas = async (): Promise<AreaDb[]> => {
  const client = await connect()
  try {
    const { rows } = await client.query('SELECT id, name, url, code, prefecture_id FROM area') as { rows: AreaDb[] }
    return rows
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

const getDomsAsync = async (area: AreaDb): Promise<JSDOM> => {
  // ページ取得
  let response
  try {
    response = await fetch(area.url)
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
    console.error(dom.window.document.body.innerHTML)
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

const getDetails = (linkContents: Element[], area: AreaDb): City[] => {
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
      prefectureId: area.prefecture_id,
      areaId: area.id
    }
    return obj
  })
  return res
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

const getCitiesAsync = async (): Promise<void> => {
  const areas = await getAreas()
  const detailsRaw = areas.map(async (area) => {
    const dom = await getDomsAsync(area)
    const linkContents = getLinkContents(dom)
    const details = getDetails(linkContents, area)
    return details
  })
  const details = (await Promise.all(detailsRaw)).flat()
  console.log(details)
  await insertCitiesAsync(details)
}

export default getCitiesAsync

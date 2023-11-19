import { JSDOM } from 'jsdom'
import { type AreaDb } from '../types'
import fetch from 'node-fetch'
import { retry } from '../utils/retry'

// 都道府県ページの取得
export const getAreaDom = async (area: AreaDb): Promise<JSDOM> => {
  // ページ取得
  let response
  try {
    response = await retry(() => fetch(area.url), 3)
  } catch (err) {
    console.error(err)
    throw new Error('area fetch error')
  }
  const body = await response.text()
  const dom = new JSDOM(body)
  return dom
}

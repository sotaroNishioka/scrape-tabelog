import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'
import { retry } from '../utils/retry'

// Cityページの取得
export const getCategoryDom = async (): Promise<JSDOM> => {
  // ページ取得
  let response
  try {
    response = await retry(() => fetch('https://tabelog.com/cat_lst'), 3)
  } catch (err) {
    console.error(err)
    throw new Error('category fetch error')
  }
  const body = await response.text()
  const dom = new JSDOM(body)
  return dom
}

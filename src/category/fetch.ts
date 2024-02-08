import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'
import { retryAsync } from '../utils/retry'

// Cityページの取得
export const getCategoryDom = async (): Promise<JSDOM> => {
  // ページ取得
  let response: fetch.Response
  try {
    response = await retryAsync<fetch.Response>(async () => {
      const res = await fetch('https://tabelog.com/cat_lst')
      return res
    }, 3)
  } catch (err) {
    console.error(err)
    throw new Error('category fetch error')
  }
  const body = await response.text()
  const dom = new JSDOM(body)
  return dom
}

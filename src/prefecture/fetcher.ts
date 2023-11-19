import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'

// 都道府県ページの取得
export const getPrefecturesDom = async (roma: string): Promise<JSDOM> => {
  // ページ取得
  let response
  try {
    response = await fetch(`https://tabelog.com/${roma}/`)
  } catch (err) {
    console.error(err)
  }
  const body = await response.text()
  const dom = new JSDOM(body)
  return dom
}

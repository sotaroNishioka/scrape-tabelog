import { JSDOM } from 'jsdom'
import { type CityDb } from '../types'
import fetch from 'node-fetch'

// Cityページの取得
export const getCityDom = async (city: CityDb): Promise<JSDOM> => {
  // ページ取得
  let response
  try {
    response = await fetch(city.url)
  } catch (err) {
    console.error(err)
    throw new Error('city fetch error')
  }
  const body = await response.text()
  const dom = new JSDOM(body)
  return dom
}

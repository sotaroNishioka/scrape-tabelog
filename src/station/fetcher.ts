import { JSDOM } from 'jsdom'
import { type StationDb } from '../types'
import fetch from 'node-fetch'

// Cityページの取得
export const getStationDom = async (station: StationDb): Promise<JSDOM> => {
  // ページ取得
  let response
  try {
    response = await fetch(station.url)
  } catch (err) {
    console.error(err)
    throw new Error('station fetch error')
  }
  const body = await response.text()
  const dom = new JSDOM(body)
  return dom
}

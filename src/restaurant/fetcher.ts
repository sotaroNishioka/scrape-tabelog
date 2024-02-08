import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'
import { retryAsync } from '../utils/retry'

export const getRestaurantCountDom = async (arg: { cityUrl: string, miniorCategoryCode: string }): Promise<JSDOM> => {
  let response: fetch.Response
  try {
    response = await retryAsync(async () => {
      const res = await fetch(`${arg.cityUrl}/rstLst/${arg.miniorCategoryCode}/`)
      return res
    }, 10)
  } catch (err) {
    console.error(err)
    throw new Error('restaurantCount fetch error')
  }
  const body = await response.text()
  const dom = new JSDOM(body)
  return dom
}

export const getRestaurantListDom = async (arg: { cityUrl: string, miniorCategoryCode: string, page: number }): Promise<JSDOM> => {
  let response: fetch.Response
  try {
    response = await retryAsync(async () => {
      const res = await fetch(`${arg.cityUrl}/rstLst/${arg.miniorCategoryCode}/${arg.page}/`)
      return res
    }, 10)
  } catch (err) {
    console.error(err)
    throw new Error('restaurantList fetch error')
  }
  const bory = await response.text()
  const dom = new JSDOM(bory)
  return dom
}

export const getRestaurantDetailDom = async (url: string): Promise<JSDOM> => {
  let response: fetch.Response
  try {
    response = await retryAsync(async () => {
      const res = await fetch(url)
      return res
    }, 10)
  } catch (err) {
    console.error(err)
    throw new Error('restaurantDetail fetch error')
  }
  const body = await response.text()
  const dom = new JSDOM(body)
  return dom
}

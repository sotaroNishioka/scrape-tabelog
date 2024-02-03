import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'
import { retry } from '../utils/retry'

export const getRestaurantCountDom = async (arg: { cityUrl: string, miniorCategoryCode: string }): Promise<JSDOM> => {
  let response
  try {
    response = await retry(() => fetch(`${arg.cityUrl}/rstLst/${arg.miniorCategoryCode}/`), 10)
  } catch (err) {
    console.error(err)
    throw new Error('restaurantCount fetch error')
  }
  const body = await response.text()
  const dom = new JSDOM(body)
  return dom
}

export const getRestaurantListDom = async (arg: { cityUrl: string, miniorCategoryCode: string, page: number }): Promise<JSDOM> => {
  let response
  try {
    response = await retry(() => fetch(`${arg.cityUrl}/rstLst/${arg.miniorCategoryCode}/${arg.page}/`), 10)
  } catch (err) {
    console.error(err)
    throw new Error('restaurantList fetch error')
  }
  const bory = await response.text()
  const dom = new JSDOM(bory)
  return dom
}

export const getRestaurantDetailDom = async (url: string): Promise<JSDOM> => {
  let response
  try {
    response = await retry(() => fetch(url), 10)
  } catch (err) {
    console.error(err)
    throw new Error('restaurantDetail fetch error')
  }
  const body = await response.text()
  const dom = new JSDOM(body)
  return dom
}

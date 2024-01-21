import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'
import { retry } from '../utils/retry'

export const getRestaurantDom = async (arg: { cityUrl: string, miniorCategoryCode: string }): Promise<JSDOM> => {
  let response
  try {
    response = await retry(() => fetch(`${arg.cityUrl}/rstLst/${arg.miniorCategoryCode}/`), 3)
  } catch (err) {
    console.error(err)
    throw new Error('restaurant fetch error')
  }
  const body = await response.text()
  const dom = new JSDOM(body)
  return dom
}

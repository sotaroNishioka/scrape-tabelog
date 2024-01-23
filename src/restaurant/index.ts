import { getCities } from '../city/db'
import { getAllMiniorCategory } from '../category/db'
import { getRestaurantCountDom, getRestaurantDetailDom, getRestaurantListDom } from './fetcher'
import { getRestaurantCount, getRestaurantDetail, getRestaurantUrls } from './dom'
import { get } from 'http'

export const asyncUpdateRestaurant = async (): Promise<void> => {
  console.log('start asyncUpdateRestaurant')
  const cities = await getCities()
  const categories = await getAllMiniorCategory()

  for (const city of cities) {
    for (const category of categories) {
      const countDom = await getRestaurantCountDom({ cityUrl: city.url, miniorCategoryCode: category.code })
      const count = getRestaurantCount(countDom)
      if (count === 0) {
        continue
      }
      const pageArr = Array.from({ length: Math.ceil(count / 20) }, (_, i) => i + 1)
      for (const page of pageArr) {
        const pageDom = await getRestaurantListDom({ cityUrl: city.url, miniorCategoryCode: category.code, page })
        const restaurantUrls = getRestaurantUrls(pageDom)
        const restaurantDetails = restaurantUrls.map(async (url) => {
          const dom = await getRestaurantDetailDom(url)
          const res = getRestaurantDetail(dom)
          return { ...res, url }
        })
        const res = await Promise.all(restaurantDetails)
        console.log(res)
      }
    }
  }
}

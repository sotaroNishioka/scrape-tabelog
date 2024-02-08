import { getCities } from '../city/db'
import { getAllMajorCategory, getAllMediumCategory, getAllMiniorCategory } from '../category/db'
import { getRestaurantCountDom, getRestaurantDetailDom, getRestaurantListDom } from './fetcher'
import { getRestaurantCount, getRestaurantDetail, getRestaurantUrls } from './dom'
import { insertRestaurantCategories, insertRestaurantsAsync } from './db'
import { retryAsync } from '../utils/retry'
import { type RestaurantDetail } from '../types'

export const asyncUpdateRestaurant = async (): Promise<void> => {
  console.log('start asyncUpdateRestaurant')
  const [cities, minorCategories, mediumCategories, majorCategories] = await Promise.all([
    getCities(),
    getAllMiniorCategory(),
    getAllMediumCategory(),
    getAllMajorCategory()
  ])

  for (const city of cities) {
    for (const category of minorCategories) {
      const countDom = await getRestaurantCountDom({ cityUrl: city.url, miniorCategoryCode: category.code })
      const count = getRestaurantCount(countDom)
      if (count === 0) {
        continue
      }
      const pageArr = Array.from({ length: Math.ceil(count / 20) }, (_, i) => i + 1)
      for (const page of pageArr) {
        const pageDom = await getRestaurantListDom({ cityUrl: city.url, miniorCategoryCode: category.code, page })
        const restaurantUrls = getRestaurantUrls(pageDom)
        const asyncRestaurantDetails = restaurantUrls.map(async (url) => {
          const res = await retryAsync<RestaurantDetail>(async () => {
            const dom = await getRestaurantDetailDom(url)
            const res = getRestaurantDetail(dom, url)
            return res
          }, 10)
          return res
        })
        const restaurantDetails = await Promise.all(asyncRestaurantDetails)
        await insertRestaurantsAsync(restaurantDetails)
        await insertRestaurantCategories({
          restaurants: restaurantDetails,
          majorCategories,
          mediumCategories,
          minorCategories
        })
      }
    }
  }
}

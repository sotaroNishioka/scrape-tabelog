import { getCities } from '../city/db'
import { getAllMiniorCategory } from '../category/db'
import { getRestaurantCountDom, getRestaurantPageDom } from './fetcher'
import { getRestaurantCount, getRestaurantUrls } from './dom'

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
        const pageDom = await getRestaurantPageDom({ cityUrl: city.url, miniorCategoryCode: category.code, page })
        const restaurantUrls = getRestaurantUrls(pageDom)
        console.log(restaurantUrls)
      }
    }
  }
}

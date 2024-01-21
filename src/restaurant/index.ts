import { getCities } from '../city/db'
import { getAllMiniorCategory } from '../category/db'
import { getRestaurantDom } from './fetcher'
import { getRestaurantCount } from './dom'

export const asyncUpdateRestaurant = async (): Promise<void> => {
  console.log('start asyncUpdateRestaurant')
  const cities = await getCities()
  const categories = await getAllMiniorCategory()

  for (const city of cities) {
    for (const category of categories) {
      const dom = await getRestaurantDom({ cityUrl: city.url, miniorCategoryCode: category.code })
      const count = getRestaurantCount(dom)
      const pageArr = Array.from({ length: Math.ceil(count / 20) }, (_, i) => i + 1)
      console.log(`city: ${city.name}, category: ${category.name}, count: ${count}, pageArr: ${pageArr.length}`)
    }
  }
}

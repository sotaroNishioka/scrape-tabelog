import { asyncUpdateAreas } from './area'
import { asyncUpdateCategory } from './category'
import { asyncUpdateCities } from './city'
import { asyncUpdateStations } from './station'
import { asyncUpdateRestaurant } from './restaurant'

const main = async (): Promise<void> => {
  const start = performance.now()
  await asyncUpdateCategory()
  await asyncUpdateAreas()
  await asyncUpdateCities()
  await asyncUpdateStations()
  await asyncUpdateRestaurant()
  const end = performance.now()
  console.log(`takes ${(end - start) / 1000} seconds`)
}

void main()

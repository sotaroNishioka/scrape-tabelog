import { asyncUpdateAreas } from './area'
import { asyncUpdateCategory } from './category'
import { asyncUpdateCities } from './city'
import { asyncUpdateStations } from './station'

const main = async (): Promise<void> => {
  const start = performance.now()
  await asyncUpdateCategory()
  await asyncUpdateAreas()
  await asyncUpdateCities()
  await asyncUpdateStations()
  const end = performance.now()
  console.log(`takes ${(end - start) / 1000} seconds`)
}

void main()

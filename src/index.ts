import { asyncUpdateAreas } from './area'
import { asyncUpdateCities } from './city'

const main = async (): Promise<void> => {
  const start = performance.now()
  await asyncUpdateAreas()
  await asyncUpdateCities()
  const end = performance.now()
  console.log(`takes ${(end - start) * 1000} seconds`)
}
void main()

import { asyncUpdateAreas } from './area'
import { asyncUpdateCities } from './city'

const main = async (): Promise<void> => {
  await asyncUpdateAreas()
  await asyncUpdateCities()
}

void main()

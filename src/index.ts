import { getPrefectures } from './prefecture'
import getAreasAsync from './area'
import getCitiesAsync from './city'

const main = async (): Promise<void> => {
  const prefectures = await getPrefectures()
  await getAreasAsync(prefectures)
  await getCitiesAsync()
}

void main()

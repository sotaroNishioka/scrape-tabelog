import { getPrefectures } from './prefecture'
import getAreas from './area'

const main = async (): Promise<void> => {
  const prefectures = await getPrefectures()
  const areaDetails = await getAreas(prefectures)
  console.log(areaDetails.length)
}

void main()

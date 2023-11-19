import { countAreaRestaurant, getDetails } from './dom'
import { insertAreaCount, insertCitiesAsync } from './db'
import { getAreas } from '../area/db'
import { getAreaDom } from '../area/fetch'

export const asyncUpdateCities = async (): Promise<void> => {
  console.log('start asyncUpdateCities')
  const areas = await getAreas()

  for (let i = 0; i < areas.length; i += 10) {
    const targets = areas.slice(i, i + 10)
    const res = targets.map(async (x, index) => {
      const dom = await getAreaDom(x)
      const count = countAreaRestaurant(dom)
      const details = getDetails({ dom, area: x })
      await Promise.all([
        insertAreaCount({ count, id: x.id }),
        insertCitiesAsync(details)
      ])
      console.log(`insertCitiesCount index = ${index + i} is done`)
      console.log(`${x.name} has ${count} restaurants`)
      console.log(`${x.name} has ${details.length} cities`)
    })
    await Promise.all(res)
  }
}

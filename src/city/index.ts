import { getCityDetails } from './dom'
import { insertCitiesAsync } from './db'
import { getAreas, insertAreaCount } from '../area/db'
import { getAreaDom } from '../area/fetch'
import { countAreaRestaurant } from '../area/dom'

export const asyncUpdateCities = async (): Promise<void> => {
  console.log('start asyncUpdateCities')
  const areas = await getAreas()

  for (let i = 0; i < areas.length; i += 10) {
    const targets = areas.slice(i, i + 10)
    const res = targets.map(async (x, index) => {
      const dom = await getAreaDom(x)
      const count = countAreaRestaurant(dom)
      const details = getCityDetails({ dom, area: x })
      await Promise.all([insertAreaCount({ count, id: x.id }), insertCitiesAsync(details)])
      console.log(`insertCitiesCount index = ${index + i} is done`)
      console.log(`${x.name} has ${count} restaurants`)
      console.log(`${x.name} has ${details.length} cities`)
    })
    await Promise.all(res)
  }
}

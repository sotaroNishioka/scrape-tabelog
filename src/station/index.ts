import { getCities, insertCityCount } from '../city/db'
import { countCityRestaurant } from '../city/dom'
import { getCityDom } from '../city/fetch'
import { insertStationsAsync } from './db'
import { getStationDetails } from './dom'
// import fetch from 'node-fetch'

export const asyncUpdateStations = async (): Promise<void> => {
  console.log('start asyncUpdateStations')
  const cities = await getCities()

  for (let i = 0; i < cities.length; i += 10) {
    const targets = cities.slice(i, i + 10)
    const res = targets.map(async (x, index) => {
      const dom = await getCityDom(x)
      const count = countCityRestaurant(dom)
      const details = getStationDetails({ dom, city: x })
      await Promise.all([
        insertCityCount({ count, id: x.id }),
        insertStationsAsync(details)
      ])
      console.log(`insertCityCount index = ${index + i} is done`)
      console.log(`${x.name} has ${count} restaurants`)
      console.log(`${x.name} has ${details.length} areas`)
    })
    await Promise.all(res)
  }
}

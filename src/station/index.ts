import { getCities, insertCityCount } from '../city/db'
import { countCityRestaurant } from '../city/dom'
import { getCityDom } from '../city/fetch'
import { getStations, insertStationsAsync } from './db'
import { getStationDetails, countStationRestaurant } from './dom'
import { getStationDom } from './fetcher'
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

  const stations = await getStations()
  console.log('start updatestation count')
  for (let i = 0; i < stations.length; i += 10) {
    const targets = stations.slice(i, i + 10)
    const res = targets.map(async (x, index) => {
      const dom = await getStationDom(x)
      const count = countStationRestaurant(dom)
      await insertCityCount({ count, id: x.id })
      console.log(`insertStationCount index = ${index + i} is done`)
      console.log(`${x.name} has ${count} restaurants`)
    })
    await Promise.all(res)
  }
  console.log('finish updatestation count')
}

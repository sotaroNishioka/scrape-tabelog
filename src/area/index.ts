import { getPrefectures } from '../prefecture/db'
import { getPrefecturesDom } from '../prefecture/fetcher'
import { countPrefectureRestaurant, getDetails } from './dom'
import { insertAreasAsync, insertPrefectureCount } from './db'

export const asyncUpdateAreas = async (): Promise<void> => {
  console.log('start asyncUpdateAreas')
  const prefectures = await getPrefectures()

  for (let i = 0; i < prefectures.length; i += 10) {
    const targets = prefectures.slice(i, i + 10)
    const res = targets.map(async (x, index) => {
      const dom = await getPrefecturesDom(x.roma)
      const count = countPrefectureRestaurant(dom)
      const details = getDetails({ dom, id: x.id })
      await Promise.all([
        insertAreasAsync(details),
        insertPrefectureCount({ count, id: x.id })
      ])
      console.log(`insertAreaCount index = ${index + i} is done`)
      console.log(`${x.yomi} has ${count} restaurants`)
      console.log(`${x.yomi} has ${details.length} areas`)
    })
    await Promise.all(res)
  }
}

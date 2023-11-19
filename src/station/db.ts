import { connect } from '../db'
import { type Station } from '../types'

export const insertStationsAsync = async (details: Station[]): Promise<void> => {
  const client = await connect()
  try {
    const values = details.map((detail) => {
      if (detail.code === '') {
        console.log(detail)
      }
      return `('${detail.name}', '${detail.url}', '${detail.code}', '${detail.prefectureId}', '${detail.areaId}', '${detail.cityId}')`
    }).join(',')
    if (values.length === 0) {
      return
    }
    await client.query(`
        INSERT INTO
          station(name, url, code, prefecture_id, area_id, city_id)
          VALUES ${values}
          ON CONFLICT (url) DO NOTHING
        `)
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

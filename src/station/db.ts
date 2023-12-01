import { connect } from '../db'
import { type StationDb, type Station } from '../types'

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

export const getStations = async (): Promise<StationDb[]> => {
  const client = await connect()
  try {
    const sql = 'SELECT id, name, url, code, area_id, prefecture_id, city_id FROM station'
    const { rows } = await client.query(sql) as { rows: StationDb[] }
    return rows
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

export const insertStationCount = async (arg: { count: number, id: string }): Promise<void> => {
  const client = await connect()
  try {
    await client.query(`
          UPDATE station
          SET restaurant_count = ${arg.count}
          WHERE id = '${arg.id}'
          `)
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

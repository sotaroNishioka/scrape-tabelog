import { connect } from '../db'
import { type StationDb, type Station } from '../types'

export const insertStationsAsync = async (details: Station[]): Promise<void> => {
  const client = await connect()
  try {
    const values = details.map((detail) => {
      return `('${detail.name}', '${detail.url}', '${detail.code}', '${detail.cityId}')`
    }).join(',')
    if (values.length === 0) {
      return
    }
    await client.query(`
        INSERT INTO
          station(name, url, code, city_id)
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
    const sql = 'SELECT id, name, url, code, city_id FROM station'
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
    INSERT INTO 
      station_history(restaurant_count, station_id)
      VALUES (${arg.count}, '${arg.id}')
    `)
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

export const getCities = async (): Promise<Array<{ id: string, name: string }>> => {
  const client = await connect()
  try {
    const sql = 'SELECT id, name FROM city'
    const { rows } = await client.query(sql) as { rows: Array<{ id: string, name: string }> }
    return rows
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

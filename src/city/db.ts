import { connect } from '../db'
import { type CityDb, type City } from '../types'

export const insertCitiesAsync = async (details: City[]): Promise<void> => {
  const client = await connect()
  try {
    const values = details.map((detail) => {
      return `('${detail.name}', '${detail.url}', '${detail.code}', '${detail.prefectureId}', '${detail.areaId}')`
    }).join(',')
    await client.query(`
        INSERT INTO 
          city(name, url, code, prefecture_id, area_id)
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

export const getCities = async (): Promise<CityDb[]> => {
  const client = await connect()
  try {
    const sql = 'SELECT id, name, url, code, area_id, prefecture_id FROM city'
    const { rows } = await client.query(sql) as { rows: CityDb[] }
    return rows
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

export const insertCityCount = async (arg: { count: number, id: string }): Promise<void> => {
  const client = await connect()
  try {
    await client.query(`
        UPDATE city
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

import { type AreaDb, type Area } from '../types'
import { connect } from '../db'

export const insertAreasAsync = async (details: Area[]): Promise<void> => {
  const client = await connect()
  try {
    const values = details.map((detail) => {
      return `('${detail.name}', '${detail.url}', '${detail.code}', '${detail.prefectureId}')`
    }).join(',')
    await client.query(`
        INSERT INTO 
          area(name, url, code, prefecture_id)
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

export const getAreas = async (): Promise<AreaDb[]> => {
  const client = await connect()
  try {
    const sql = 'SELECT id, name, url, code, prefecture_id FROM area'
    const { rows } = await client.query(sql) as { rows: AreaDb[] }
    return rows
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

export const insertAreaCount = async (arg: { count: number, id: string }): Promise<void> => {
  const client = await connect()
  try {
    await client.query(`
          UPDATE area
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

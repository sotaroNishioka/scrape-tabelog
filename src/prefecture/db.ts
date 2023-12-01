import { connect } from '../db'
import { type PrefectureDb } from '../types'

export const getPrefectures = async (): Promise<PrefectureDb[]> => {
  const client = await connect()
  try {
    const sql = 'SELECT id, kanji, yomi, roma FROM prefecture'
    const { rows } = await client.query(sql) as { rows: PrefectureDb[] }
    return rows
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

export const insertPrefectureCount = async (arg: { count: number, id: string }): Promise<void> => {
  const client = await connect()
  try {
    await client.query(`
          UPDATE prefecture
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

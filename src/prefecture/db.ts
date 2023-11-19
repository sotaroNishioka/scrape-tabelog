import { connect } from '../db'
import { type PrefectureDb } from '../types'

export const getPrefectures = async (): Promise<PrefectureDb[]> => {
  const client = await connect()
  try {
    const sql = process.env.PREFECTURE === undefined
      ? 'SELECT id, kanji, yomi, roma FROM prefecture'
      : `SELECT id, kanji, yomi, roma FROM prefecture WHERE id = '${process.env.PREFECTURE}'`
    const { rows } = await client.query(sql) as { rows: PrefectureDb[] }
    return rows
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

import { connect } from '../db'
import { type PrefectureDb } from '../types'

export const getPrefectures = async (): Promise<PrefectureDb[]> => {
  const client = await connect()
  try {
    const { rows } = await client.query('SELECT id, kanji, yomi, roma FROM prefecture') as { rows: PrefectureDb[] }
    return rows
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

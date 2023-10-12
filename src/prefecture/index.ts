import { connect } from '../db'

interface Prefecture {
  kanji: string
  yomi: string
  roma: string
  id: string
}

export const getPrefectures = async (): Promise<Prefecture[]> => {
  const client = await connect()
  try {
    const { rows } = await client.query('SELECT id, kanji, yomi, roma FROM prefecture') as { rows: Prefecture[] }
    return rows
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

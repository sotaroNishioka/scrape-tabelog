import { type PrefectureDb } from '../types'

import { JSDOM } from 'jsdom'
import { connect } from '../db'
import fetch from 'node-fetch'

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

// 都道府県ページの取得
export const getPrefecturesDom = async (roma: string): Promise<JSDOM> => {
  // ページ取得
  let response
  try {
    response = await fetch(`https://tabelog.com/${roma}/`)
  } catch (err) {
    console.error(err)
  }
  const body = await response.text()
  const dom = new JSDOM(body)
  return dom
}

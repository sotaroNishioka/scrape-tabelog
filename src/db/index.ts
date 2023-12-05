import { Client } from 'pg'
import 'dotenv/config'

export async function connect (): Promise<Client> {
  let client: Client
  try {
    client = new Client({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    })
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  }
  await client.connect()
  return client
}

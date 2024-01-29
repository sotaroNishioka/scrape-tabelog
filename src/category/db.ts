import { connect } from '../db'
import { type MediumCategoryDb, type MajorCategoryDb, type MajorCategory, type MinorCategory, type MediumCategory, type MinorCategoryDb } from '../types'

export const insertMajorCategoriesAsync = async (details: MajorCategory[]): Promise<void> => {
  const client = await connect()
  try {
    const values = details.map((detail) => {
      return `('${detail.name}', '${detail.code}')`
    }).join(',')
    await client.query(`
        INSERT INTO 
          major_category(name, code)
          VALUES ${values}
          ON CONFLICT (code) DO NOTHING
        `)
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

export const insertMediumCategoriesAsync = async (details: MediumCategory[]): Promise<void> => {
  const client = await connect()
  try {
    const values = details.map((detail) => {
      return `('${detail.name}', '${detail.code}', '${detail.majorCategoryId}')`
    }).join(',')
    await client.query(`
          INSERT INTO 
            medium_category(name, code, major_category_id)
            VALUES ${values}
            ON CONFLICT (code) DO NOTHING
          `)
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

export const insertMinorCategoriesAsync = async (details: MinorCategory[]): Promise<void> => {
  const client = await connect()
  try {
    const values = details.map((detail) => {
      return `('${detail.name}', '${detail.code}', '${detail.majorCategoryId}', '${detail.mediumCategoryId}')`
    }).join(',')
    await client.query(`
            INSERT INTO 
              minor_category(name, code, major_category_id, medium_category_id)
              VALUES ${values}
              ON CONFLICT (code) DO NOTHING
            `)
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

export const getMajorCategory = async (code: string): Promise<MajorCategoryDb> => {
  const client = await connect()
  try {
    const result = await client.query(`
            SELECT * FROM major_category WHERE code = '${code}'
        `)
    return result.rows[0]
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

export const getMediumCategory = async (code: string): Promise<MediumCategoryDb> => {
  const client = await connect()
  try {
    const result = await client.query(`
              SELECT * FROM medium_category WHERE code = '${code}'
          `)
    return result.rows[0]
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

export const getAllMiniorCategory = async (): Promise<MinorCategoryDb[]> => {
  const client = await connect()
  try {
    const result = await client.query(`
                SELECT * FROM minor_category
            `)
    return result.rows
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

export const getAllMediumCategory = async (): Promise<MediumCategoryDb[]> => {
  const client = await connect()
  try {
    const result = await client.query(`
                  SELECT * FROM medium_category
              `)
    return result.rows
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

export const getAllMajorCategory = async (): Promise<MajorCategoryDb[]> => {
  const client = await connect()
  try {
    const result = await client.query(`
                    SELECT * FROM major_category
                `)
    return result.rows
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

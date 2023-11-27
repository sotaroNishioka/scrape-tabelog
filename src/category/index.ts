import { getCategoryDom } from './fetch'
import { getMajorCategories, getMediumCategories, getMinorCategories } from './dom'
import { insertMajorCategoriesAsync, insertMediumCategoriesAsync, insertMinorCategoriesAsync } from './db'

export const asyncUpdateCategory = async (): Promise<void> => {
  console.log('start asyncUpdateCategory')
  const dom = await getCategoryDom()
  const majorCategories = getMajorCategories(dom)
  await insertMajorCategoriesAsync(majorCategories)

  const mediumCategories = await getMediumCategories(dom)
  await insertMediumCategoriesAsync(mediumCategories)

  const minorCategories = await getMinorCategories(dom)
  await insertMinorCategoriesAsync(minorCategories)
}

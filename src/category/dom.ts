import { type JSDOM } from 'jsdom'
import { type MajorCategory, type MediumCategory, type MinorCategory } from '../types'
import { getMajorCategory, getMediumCategory } from './db'

const getMajorFromArea = (area: Element): MajorCategory => {
  const title = area.querySelector('.rst-janrelst__title')
  if (title === null) {
    throw new Error('majorCategory title is not found')
  }
  const target = title.querySelector('.rst-janrelst__title-target')
  if (target === null) {
    throw new Error('majorCategory target is not found')
  }
  const name = target.textContent
  if (name === null) {
    throw new Error('majorCategory name is not found')
  }
  const link = target.getAttribute('href')
  if (link === null) {
    throw new Error('majorCategory link is not found')
  }
  const code = link.split('/').slice(-2)[0]
  return {
    name,
    code
  }
}

const getMediumCategoriesFromMedium = (medium: Element): {
  name: string
  code: string } => {
  const val = medium.querySelector('.rst-janrelst__item2')
  if (val === null) {
    throw new Error('mediumCategory val is not found')
  }
  const aTag = val.querySelector('a')
  if (aTag === null) {
    throw new Error('mediumCategory aTag is not found')
  }
  const name = aTag.textContent
  if (name === null) {
    throw new Error('mediumCategory name is not found')
  }
  const link = aTag.getAttribute('href')
  if (link === null) {
    throw new Error('mediumCategory link is not found')
  }
  const code = link.split('/').slice(-2)[0]
  return {
    name,
    code
  }
}

export const getMajorCategories = (dom: JSDOM): MajorCategory[] => {
  const area = dom.window.document.querySelectorAll('.rst-janrelst__frame')
  const majorCategories = Array.from(area).map((x) => {
    return getMajorFromArea(x)
  })
  return majorCategories
}

export const getMediumCategories = async (dom: JSDOM): Promise<MediumCategory[]> => {
  const area = dom.window.document.querySelectorAll('.rst-janrelst__frame')
  const mediumCategories = Array.from(area).map(async (x) => {
    const majorCategory = getMajorFromArea(x)
    const majorCategoryId = (await getMajorCategory(majorCategory.code)).id
    const mediums = Array.from(x.querySelectorAll('.rst-janrelst__item'))
    return mediums.map((y) => {
      const mediumCategory = getMediumCategoriesFromMedium(y)
      return {
        ...mediumCategory,
        majorCategoryId
      }
    })
  })
  const res = (await Promise.all(mediumCategories)).flat()
  return res
}

export const getMinorCategories = async (dom: JSDOM): Promise<MinorCategory[]> => {
  const area = dom.window.document.querySelectorAll('.rst-janrelst__frame')
  const mediumCategories = Array.from(area).map(async (x) => {
    const majorCategory = getMajorFromArea(x)
    const majorCategoryId = (await getMajorCategory(majorCategory.code)).id
    const mediums = Array.from(x.querySelectorAll('.rst-janrelst__item'))
    const asyncRes = mediums.map(async (y) => {
      const mediumCategory = getMediumCategoriesFromMedium(y)
      const mediumCategoryId = (await getMediumCategory(mediumCategory.code)).id
      const ul = y.querySelector('.rst-janrelst__item3')
      if (ul === null) {
        return []
      }
      const lis = Array.from(ul.querySelectorAll('li'))
      if (lis.length === 0) {
        return []
      }
      return lis.map((z) => {
        const aTag = z.querySelector('a')
        if (aTag === null) {
          throw new Error('minorCategory aTag is not found')
        }
        const name = aTag.textContent
        if (name === null) {
          throw new Error('minorCategory name is not found')
        }
        const link = aTag.getAttribute('href')
        if (link === null) {
          throw new Error('minorCategory link is not found')
        }
        const code = link.split('/').slice(-2)[0]
        return {
          name,
          code,
          majorCategoryId,
          mediumCategoryId
        }
      })
    })
    return (await Promise.all(asyncRes)).flat()
  })
  const res = (await Promise.all(mediumCategories)).flat()
  return res
}

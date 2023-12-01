export interface PrefectureDb {
  id: string
  kanji: string
  yomi: string
  roma: string
}

export interface Area {
  name: string
  url: string
  code: string
  prefectureId: string
}

export interface AreaDb {
  id: string
  name: string
  url: string
  code: string
  prefecture_id: string
}

export interface City {
  name: string
  url: string
  code: string
  areaId: string
}

export interface CityDb {
  id: string
  name: string
  url: string
  code: string
  area_id: string
}
export interface Station {
  name: string
  url: string
  code: string
  cityId: string
}

export interface StationDb {
  id: string
  name: string
  url: string
  code: string
  city_id: string
}

export interface MajorCategory {
  name: string
  code: string
}

export interface MajorCategoryDb {
  id: string
  name: string
  code: string
}

export interface MediumCategory {
  name: string
  code: string
  majorCategoryId: string
}

export interface MediumCategoryDb {
  id: string
  name: string
  code: string
  major_category_id: string
}

export interface MinorCategory {
  name: string
  code: string
  majorCategoryId: string
  mediumCategoryId: string
}

export interface MinorCategoryDb {
  id: string
  name: string
  code: string
  major_category_id: string
  medium_category_id: string
}

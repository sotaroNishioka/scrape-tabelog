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

export interface RestaurantDetail {
  url: string
  prefectureCode: string
  areaCode: string
  cityCode: string
  code: string
  stationCode: string | null
  name: string | null
  address: string | null
  mapImageUrl: string | null
  tel: string | null
  rate: number | null
  review: number | null
  bookMark: number | null
  photoCount: number | null
  isAbleReserve: boolean
  budget: { lunch: { min: number, max: number } | null, dinner: { min: number, max: number } | null } | null
  categoryCodes: string[] | null
  transportation: string | null
  openingHours: string | null
  holiday: string | null
  tax: string | null
  seat: number | null
  smoking: string | null
  parking: string | null
  child: string | null
  note: string | null
  homePage: string | null
}

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
  prefectureId: string
  areaId: string
}

export interface CityDb {
  id: string
  name: string
  url: string
  code: string
  prefecture_id: string
  area_id: string
}
export interface Station {
  name: string
  url: string
  code: string
  prefectureId: string
  areaId: string
  cityId: string
}

export interface StationDb {
  id: string
  name: string
  url: string
  code: string
  prefecture_id: string
  area_id: string
  city_id: string
}

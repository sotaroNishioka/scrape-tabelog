export interface Prefecture {
  kanji: string
  yomi: string
  roma: string
  id: string
}

export interface Area {
  name: string
  url: string
  code: string
  prefectureId: string
}

export interface City {
  name: string
  url: string
  code: string
  prefectureId: string
  areaId: string
}

export interface Station {
  name: string
  url: string
  code: string
  prefectureId: string
  areaId: string
  cityId: string
}

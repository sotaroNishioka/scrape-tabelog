import { connect } from '../db'
import { type RestaurantDetail } from '../types'

export const insertRestaurantsAsync = async (details: RestaurantDetail[]): Promise<void> => {
  const client = await connect()

  try {
    const values = details.map((_, index) => `($${index * 23 + 1}, $${index * 23 + 2}, $${index * 23 + 3}, $${index * 23 + 4}, $${index * 23 + 5}, $${index * 23 + 6}, $${index * 23 + 7}, $${index * 23 + 8}, $${index * 23 + 9}, $${index * 23 + 10}, $${index * 23 + 11}, $${index * 23 + 12}, $${index * 23 + 13}, $${index * 23 + 14}, $${index * 23 + 15}, $${index * 23 + 16}, $${index * 23 + 17}, $${index * 23 + 18}, $${index * 23 + 19}, $${index * 23 + 20}, $${index * 23 + 21}, $${index * 23 + 22}, $${index * 23 + 23})`).join(',')
    console.log(values)
    const params = details.flatMap(obj => [obj.url, obj.areaCode, obj.cityCode, obj.stationCode, obj.name, obj.code, obj.address, obj.mapImageUrl, obj.tel, obj.rate, obj.bookMark, obj.photoCount, obj.isAbleReserve, obj.budget, obj.transportation, obj.holiday, obj.tax, obj.seat, obj.smoking, obj.parking, obj.child, obj.note, obj.homePage])
    console.log(params)

    const sql = `
    INSERT INTO
      restaurant (
      url,
      area_code,
      city_code,
      station_code,
      name,
      code,
      address,
      mapImageUrl,
      tel,
      rate,
      book_mark,
      photo_count,
      is_able_reserve,
      budget,
      transportation,
      holiday,
      tax,
      seat,
      smoking,
      parking,
      child,
      note,
      home_page
    )
    VALUES ${values}
    ON CONFLICT (url)
    DO UPDATE SET 
      area_code = EXCLUDED.area_code,
      city_code = EXCLUDED.city_code,
      station_code = EXCLUDED.station_code,
      name = EXCLUDED.name,
      code = EXCLUDED.code,
      address = EXCLUDED.address,
      mapImageUrl = EXCLUDED.mapImageUrl,
      tel = EXCLUDED.tel,
      rate = EXCLUDED.rate,
      book_mark = EXCLUDED.book_mark,
      photo_count = EXCLUDED.photo_count,
      is_able_reserve = EXCLUDED.is_able_reserve,
      budget = EXCLUDED.budget,
      transportation = EXCLUDED.transportation,
      holiday = EXCLUDED.holiday,
      tax = EXCLUDED.tax,
      seat = EXCLUDED.seat,
      smoking = EXCLUDED.smoking,
      parking = EXCLUDED.parking,
      child = EXCLUDED.child,
      note = EXCLUDED.note,
      home_page = EXCLUDED.home_page;
   `
    await client.query(sql, params)
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

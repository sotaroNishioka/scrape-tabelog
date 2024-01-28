import { connect } from '../db'
import { type RestaurantDetail } from '../types'

export const insertRestaurantsAsync = async (details: RestaurantDetail[]): Promise<void> => {
  const client = await connect()
  try {
    const values = details.map((detail) => {
      return `('${detail.url}', '${detail.areaCode}', '${detail.cityCode}', '${detail.stationCode}', '${detail.name}', '${detail.code}', '${detail.address}', '${detail.mapImageUrl}', '${detail.tel}', ${detail.rate}, ${detail.bookMark}, ${detail.photoCount}, ${detail.isAbleReserve}, '[${JSON.stringify(detail.budget)}]', '${detail.transportation}', '${detail.holiday}', '${detail.tax}', ${detail.seat}, '${detail.smoking}', '${detail.parking}', '${detail.child}', '${detail.note}', '${detail.homePage}')`
    }).join(',')
    if (values.length === 0) {
      return
    }
    console.log(`
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
   `)
    await client.query(`
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
   `)
  } catch (err) {
    console.error(err)
    throw new Error('DB Error')
  } finally {
    await client.end()
  }
}

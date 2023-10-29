import { asyncUpdateAreas } from './area'
import { asyncUpdateCities } from './city'

const main = async (): Promise<void> => {
  // 都道府県指定なしの場合はメモリを節約するために処理をスキップする
  // console.log(process.env.PREFECTURE)
  // if (process.env.PREFECTURE === undefined) {
  //   return
  // }
  await asyncUpdateAreas()
  await asyncUpdateCities()
}

void main()

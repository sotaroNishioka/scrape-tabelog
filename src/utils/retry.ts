export const retryAsync = async <T>(func: () => Promise<T>, count: number): Promise<T> => {
  try {
    return await func()
  } catch (e) {
    if (count === 0) {
      throw new Error(`再試行回数の上限に達しました: ${e}`)
    }
    console.log(`再試行します...（残り試行回数: ${count} at ${new Date().toISOString()}`)
    return await retryAsync(func, count - 1)
  }
}

export const retry = <T>(func: () => T, count: number): T => {
  try {
    return func()
  } catch (e) {
    if (count === 0) {
      throw new Error(`再試行回数の上限に達しました: ${e}`)
    }
    console.log(`再試行します...（残り試行回数: ${count} at ${new Date().toISOString()}`)
    return retry(func, count - 1)
  }
}

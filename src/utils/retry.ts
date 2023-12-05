export const retry = async<T>(func: () => Promise<T>, count: number): Promise<T> => {
  try {
    return await func()
  } catch (e) {
    if (count === 1) {
      console.error(e)
      throw new Error(`retry Error  tried ${count} times`)
    }
    console.warn('retryed')
    return await retry(func, count - 1)
  }
}

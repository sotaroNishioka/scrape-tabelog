export const retry = async<T>(func: () => Promise<T>, count: number): Promise<T> => {
  try {
    return await func()
  } catch (e) {
    if (count === 1) {
      console.error(e)
    }
    console.warn(`retryed at ${new Date().toISOString()}`)
    return await retry(func, count - 1)
  }
}

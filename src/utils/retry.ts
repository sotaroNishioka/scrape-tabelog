export const retryAsync = async<T>(func: () => Promise<T>, count: number): Promise<T> => {
  try {
    return await func()
  } catch (e) {
    if (count === 1) {
      console.error(e)
    }
    console.warn(`retryed at ${new Date().toISOString()}`)
    return await retryAsync(func, count - 1)
  }
}

export const retry = <T>(func: () => T, count: number): T => {
  try {
    return func()
  } catch (e) {
    if (count === 1) {
      console.error(e)
    }
    console.warn(`retryed at ${new Date().toISOString()}`)
    return retry(func, count - 1)
  }
}

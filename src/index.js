export function piggyback (fn, getKey) {
  getKey = getKey || (() => fn.name)

  const jobs = new Map()

  return async (...args) => {
    const key = getKey(...args)
    let job = jobs.get(key)

    if (job) {
      return new Promise((resolve, reject) => {
        job.onComplete.addListener(resolve)
        job.onError.addListener(reject)
      })
    }

    job = {
      onComplete: new Event('onComplete'),
      onError: new Event('onError')
    }

    jobs.set(key, job)

    try {
      const res = await fn(...args)
      job.onComplete.emit(res)
      return res
    } catch (err) {
      job.onError.emit(err)
      throw err
    } finally {
      jobs.delete(key)
    }
  }
}

class Event {
  constructor (name) {
    this._name = name
    this._listeners = []
  }
  addListener (handler) {
    this._listeners.push(handler)
  }
  emit (...args) {
    this._listeners.forEach(handler => handler(...args))
  }
}

export default (result) => {
  const jobFn = function () {
    const args = Array.from(arguments)
    jobFn.callCount++
    jobFn.calls.push({ args })

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (result instanceof Error) reject(result)
        else resolve(result)
      })
    })
  }

  jobFn.callCount = 0
  jobFn.calls = []
  return jobFn
}

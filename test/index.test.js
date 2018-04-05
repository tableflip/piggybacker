import test from 'ava'
import createJob from './helpers/job'
import piggyBack from '../'

test('should run a job', async t => {
  const key = 'TEST'
  const result = 138
  const jobFn = createJob(result)
  const pb = piggyBack(jobFn, () => key)
  t.is(await pb(), result)
})

test('should run a failing job', async t => {
  const key = 'TEST'
  const result = new Error('Boom')
  const jobFn = createJob(result)
  const pb = piggyBack(jobFn, () => key)
  const err = await t.throws(pb())
  t.is(err.message, result.message)
})

test('should piggyback a job', async t => {
  const key = 'TEST'
  const result = 138
  const jobFn = createJob(result)
  const pb = piggyBack(jobFn, () => key)
  let results

  results = await Promise.all([pb(), pb(), pb(), pb()])

  results.forEach(r => t.is(r, result))
  t.is(jobFn.callCount, 1)

  results = await Promise.all([pb(), pb(), pb()])

  results.forEach(r => t.is(r, result))
  t.is(jobFn.callCount, 2)
})

test('should piggyback a failing job', async t => {
  const key = 'TEST'
  const result = new Error('Boom')
  const jobFn = createJob(result)
  const pb = piggyBack(jobFn, () => key)

  const err = await t.throws(Promise.all([pb(), pb(), pb(), pb()]))

  t.is(err.message, result.message)
  t.is(jobFn.callCount, 1)
})

test('should call job function with passed args', async t => {
  const key = 'TEST'
  const result = 138
  const jobFn = createJob(result)
  const jobArgs = [1, 2, 3]
  const pb = piggyBack(jobFn, () => key)
  await pb(...jobArgs)
  t.is(jobFn.callCount, 1)
  t.deepEqual(jobFn.calls[0].args, jobArgs)
})

test('should pass job args to key function', async t => {
  const key = 'TEST'
  const result = 138
  const jobFn = createJob(result)
  const jobArgs = [1, 2, 3]
  const pb = piggyBack(jobFn, (...args) => {
    t.deepEqual(args, jobArgs)
    return key
  })
  await pb(...jobArgs)
})

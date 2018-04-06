# piggybacker

[![Build Status](https://travis-ci.org/tableflip/piggybacker.svg?branch=master)](https://travis-ci.org/tableflip/piggybacker) [![dependencies Status](https://david-dm.org/tableflip/piggybacker/status.svg)](https://david-dm.org/tableflip/piggybacker) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Async keyed job runner, piggyback on results from running jobs with the same key

## Usage

```js
import { piggyback } from 'piggybacker'

async function fetchJSON (url) {
  const res = await window.fetch(url)
  return res.json()
}

const piggyFetchJSON = piggyback(
  fetchJSON,
  // Given the args that will be passed to fetchJSON, generate a key so that if
  // a second call is made while the first is in flight then the second will
  // ALSO receive the results of the first, instead of having to make a
  // separate request.
  function getKey (url) {
    return url
  }
)

const results = await Promise.all([
  // Multiple calls to piggyFetchJSON with the same URL _while_ a request is in
  // progress will not send another request! Instead they'll wait on the results
  // of the first.
  piggyFetchJSON('https://example.org/data.json'),
  piggyFetchJSON('https://example.org/data.json'),
  piggyFetchJSON('https://example.org/data.json')
])

// fetchJSON called only ONCE!
```

## API

### `piggyback(fn, getKey)`

Create a new function that'll call `fn` and piggyback on the results if called again.

* `fn` - the function to piggyback on
* `getKey` - a function called before each call to `fn` that generates a key for the call. Two or more calls with the same key will be piggybacked

## Contribute

Feel free to dive in! [Open an issue](https://github.com/tableflip/piggybacker/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw

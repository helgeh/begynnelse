
const debug = process.env.DEBUG_APP || false

export function log(...args) {
  if (debug)
    console.log(...args)
}

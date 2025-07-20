export * from './app.js'
export * from './user.js'
export * from './links.js'

export function getMyToken() {
  return localStorage.getItem('mitt-merke')
}

export async function attachTokenHeader({ url, options, cancel }) {
  const myToken = await getMyToken()
  if (!myToken)
    cancel()
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${myToken}`,
  }
  return { options }
}

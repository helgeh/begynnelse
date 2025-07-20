import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const saltRounds = 10

export async function hashPassword(password) {
  return new Promise((res, rej) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) {
        console.log('some error during password encryption', err)
        rej('Error')
        return
      }
      res(hash)
    })
  })
}

export async function checkPassword(password, hash) {
  return new Promise((res, rej) => {
    bcrypt.compare(password, hash, function(err, result) {
      if (err) {
        console.log('some error during password comparison')
        rej(false)
        return
      }
      res(result)
    })
  })
}

export function authTheToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null || token === 'null') return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403)
    }

    req.user = user

    next()
  })
}

export function makeTheToken(id, username) {
  return jwt.sign({ id, username }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_TIMEOUT,
  }) // '7d'
}

export function getPasswordComplexityScore(pw) {
  if (pw.length < 8)
    return 0
  const hasLongLength = pw.length > 11
  const hasUpperCase = /[A-Z]/.test(pw)
  const hasLowerCase = /[a-z]/.test(pw)
  const hasNumbers = /\d/.test(pw)
  const hasNonalphas = /\W/.test(pw)
  return hasLongLength + hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas
}

export function randomHex(len) {
  return crypto.randomBytes(len).toString('hex')
}

// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken'

const users = [{ id: 1, username: 'helge', password: 'astakask' }]

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
    expiresIn: '1800s',
  }) // '7d'
}

export function isRealUser(usr, pw) {
  const user = users.find((user) => user.username === usr)
  if (!user || user.password !== pw) {
    return false
  }
  return true
}

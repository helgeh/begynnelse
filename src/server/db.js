import { open } from 'node:fs/promises'
import Database from 'better-sqlite3'

import { hashPassword } from './sikkerhet.js'
import * as dbSeeder from './db-seeder.js'
import { log } from './logger.js'


const logVerbose = process.env.DEBUG_APP || false
const logSql = function (...args) {
  if (logVerbose)
    log(...args)
}

const dbFile = './src/server/db/begynnelse.db'

let testFile, seedDb = false
try {
  testFile = await open(dbFile, 'wx')
  log('DB file created. Will seed.')
  seedDb = true
}
catch (err) {
  if (err.errno === -17)
    log('DB file already exists.')
  else
    log('Something wrong opening DB file', err)
}
finally {
  await testFile?.close()
}

const db = new Database(dbFile, { verbose: logSql })
db.pragma('journal_mode = WAL')


if (seedDb) {
  try {
    const result = await dbSeeder.run(db, {
      logger: log
    })
    if (!result)
      throw new Error('Noe gikk feil under seeding men det smalt ikke?')
    seedDb = false
  }
  catch (err) {
    log('Kunne ikke seede datase?? ', err.message)
    throw err
  }
}


const insertUserStmt = db.prepare('INSERT INTO users (name, email, password, details) VALUES (?, ?, ?, ?)')
const updateUserDetailsStmt = db.prepare('UPDATE users SET details = ? WHERE id = ?')
const removeUserByIdStmt = db.prepare('DELETE from users WHERE id = ?')
const userByIdStmt = db.prepare('SELECT name, email FROM users WHERE id = ?')
const userByEmailStmt = db.prepare('SELECT id, name, email, password, details FROM users WHERE email = ?')

async function addUser(email, password, details) {
  const user = getUserByEmail(email)
  const hash = await hashPassword(password)
  if (user && user.email === email)
    throw new Error('User already exists')
  insertUserStmt.run('', email, hash, details)
}

function setUserDetails(email, str) {
  const user = getUserByEmail(email)
  if (!user)
    throw new Error('User not found')
  updateUserDetailsStmt.run(str, user.id)
}

function removeUser(id) {
  const user = getUserById(id)
  if (user)
    removeUserByIdStmt.run(id)
  else throw new Error('User not found')
  return user
}

function getUserById(id) {
  return userByIdStmt.get(id)
}

function getUserByEmail(email) {
  return userByEmailStmt.get(email)
}

const insertCategoryStmt = db.prepare('INSERT INTO categories (name, title, user) VALUES (?, ?, ?)')
const getCategoriesStmt = db.prepare('SELECT * from categories WHERE user = ?')
const getCategoryStmt = db.prepare('SELECT * from categories WHERE name = ? AND user = ?')

function addCategory(name, title, userId) {
  const cat = getCategory(name, userId)
  if (cat)
    throw new Error('Category already exists for this user')
  insertCategoryStmt.run(name, title, userId)
}

function getCategories(userId) {
  return getCategoriesStmt.all(userId)
}

function getCategory(name, userId) {
  return getCategoryStmt.run(name, userId)
}

const insertLinksStmt = db.prepare('INSERT INTO links (name, url, user) VALUES (?, ?, ?)')
const insertCompleteLinksStmt = db.prepare('INSERT INTO links (name, url, category, tags, icon, user) VALUES (:name, :url, :category, :tags, :icon, ?)')
const updateLinkStmt = db.prepare('UPDATE links SET name = :name, url = :url, icon = :icon, category = :category, tags = :tags WHERE id = :id')
const updateLinkIconStmt = db.prepare('UPDATE links SET icon = :icon WHERE id = :id')
const updateLinkCategoryStmt = db.prepare('UPDATE links SET category = :category WHERE id = :id')
const updateLinkTagsStmt = db.prepare('UPDATE links SET tags = :tags WHERE id = :id')
const deleteLinkStmt = db.prepare('DELETE FROM links WHERE id = ?')
const linksByUserStmt = db.prepare('SELECT id, name, url, icon, category, tags FROM links WHERE user = ? ORDER BY id')
const linkByIdStmt = db.prepare('SELECT id, name, url, icon, category, tags, user FROM links WHERE id = ?')

function addLink(name, url, user) {
  return insertLinksStmt.run(name, url, user)
}

function addCompleteLink(link, userId) {
  return insertCompleteLinksStmt.run(userId, link)
}

function updateLink(link) {
  return updateLinkStmt.run(link)
}

function setLinkIcon(id, icon) {
  updateLinkIconStmt.run({id, icon})
}

function setLinkCategory(id, category) {
  updateLinkCategoryStmt.run({id, category})
}

function setLinkTags(id, tags) {
  updateLinkTagsStmt.run({id, tags})
}

function deleteLink(id) {
  return deleteLinkStmt.run(id)
}

function getLinks(userId) {
  return linksByUserStmt.all(userId)
}

function getLink(id) {
  return linkByIdStmt.get(id)
}

// log('user', getUserByEmail('haefs@pm.me'))
// log('links', getLinks(1))

export {
  addUser,
  setUserDetails,
  removeUser,
  getUserByEmail,
  getUserById,
  
  getCategories,

  addLink,
  addCompleteLink,
  updateLink,
  setLinkIcon,
  setLinkCategory,
  setLinkTags,
  deleteLink,
  getLinks,
  getLink
}

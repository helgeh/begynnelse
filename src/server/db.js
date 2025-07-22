import { open } from 'node:fs/promises'
import Database from 'better-sqlite3'

import { hashPassword } from './sikkerhet.js'
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
  console.log('DB file created!. Will seed.')
  seedDb = true
}
catch (err) {
  console.log('DB file already exists, or some error occured.', err)
}

const db = new Database(dbFile, { verbose: logSql })
db.pragma('journal_mode = WAL')

const createLinks = db.prepare(`
  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    user INTEGER NOT NULL,
    icon TEXT,
    category TEXT,
    tags TEXT,
    FOREIGN KEY(user) REFERENCES users(id)
  );
`)
createLinks.run()

const createCategories = db.prepare(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    user INTEGER NOT NULL,
    FOREIGN KEY(user) REFERENCES users(id)
  );
`)
createCategories.run()

// try {
//   db
//     .prepare(`ALTER TABLE links ADD COLUMN icon TEXT`)
//     .run()
// }
// catch (e) {
//   console.log('update links failed')
// }

const createUsers = db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    details TEXT
  );
`)
createUsers.run()


if (seedDb) {
  console.log('Seeding DB...')
  const userResult = db.prepare('INSERT INTO users (name, email, password, details) VALUES (?, ?, ?, ?)')
    .run('hjh', process.env.ADMIN_EMAIL, process.env.ADMIN_PW, `et:CONFIRMED-${Date.now()};`)
  console.log('  Added user with id ' + userResult.lastInsertRowid)
  const linksStmt = db.prepare('INSERT INTO links (name, url, icon, category, tags, user) VALUES (?, ?, ?, ?, ?, ?)')
  linksStmt.run(
    "Proton.mail", 
    "https://mail.proton.me",
    "https://favicone.com/mail.proton.me?s=32",
    "common",
    "mail,proton,pri1,standard",
    userResult.lastInsertRowid
  )
  linksStmt.run(
    "Proton.pass", 
    "https://pass.proton.me",
    "https://favicone.com/pass.proton.me?s=32",
    "common",
    "passwords,proton,pri1,standard",
    userResult.lastInsertRowid
  )
  linksStmt.run(
    "Github",
    "https://github.com/helgeh",
    `{ "light": "/icons/github-light-32x32.png", "dark": "/icons/github-dark-32x32.png" }`,
    "develop",
    "code,git,pri1,standard",
    userResult.lastInsertRowid
  )
  const categoryStmt = db.prepare('INSERT INTO categories (name, title, user) VALUES (?, ?, ?)')
  categoryStmt.run('common', 'Basic', userResult.lastInsertRowid)
  categoryStmt.run('develop', 'Develop', userResult.lastInsertRowid)
  console.log('    Done seeding DB!')
  seedDb = false
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
  updateLink,
  setLinkIcon,
  setLinkCategory,
  setLinkTags,
  deleteLink,
  getLinks,
  getLink
}

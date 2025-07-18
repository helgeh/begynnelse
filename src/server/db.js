import Database from 'better-sqlite3';

import { hashPassword } from './sikkerhet.js'


const logVerbose = process.env.DEBUG_APP || false
const logSql = function (...args) {
  if (logVerbose)
    console.log(...args)
}

const db = new Database('./begynnelse.db', { verbose: logSql })
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
    name TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL
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



const insertUser = db.prepare('INSERT INTO users (name, email, password, details) VALUES (?, ?, ?, ?)')
const updateUserDetails = db.prepare('UPDATE users SET details = ? WHERE id = ?')
const removeUserById = db.prepare('DELETE from users WHERE id = ?')
const userById = db.prepare('SELECT name, email FROM users WHERE id = ?')
const userByEmail = db.prepare('SELECT id, name, email, password, details FROM users WHERE email = ?')

async function addUser(email, password, details) {
  const user = getUserByEmail(email)
  const hash = await hashPassword(password)
  if (user && user.email === email)
    throw new Error('User already exists')
  insertUser.run('', email, hash, details)
}

function setUserDetails(email, str) {
  const user = getUserByEmail(email)
  if (!user)
    throw new Error('User not found')
  updateUserDetails.run(str, user.id)
}

function removeUser(id) {
  const user = getUserById(id)
  if (user)
    removeUserById.run(id)
  else throw new Error('User not found')
  return user
}

function getUserById(id) {
  return userById.get(id)
}

function getUserByEmail(email) {
  return userByEmail.get(email)
}

const insertCategory = db.prepare('INSERT INTO categories (name, title) VALUES (?, ?)')
const categories = db.prepare('SELECT * from categories')

function addCategory(name, title) {
  insertCategory.run(name, title)
}

function getCategories() {
  return categories.all()
}

const insertLinks = db.prepare('INSERT INTO links (name, url, user) VALUES (?, ?, ?)')
const updateLinkIcon = db.prepare('UPDATE links SET icon = :icon WHERE id = :id')
const updateLinkCategory = db.prepare('UPDATE links SET category = :category WHERE id = :id')
const updateLinkTags = db.prepare('UPDATE links SET tags = :tags WHERE id = :id')
const linksByUser = db.prepare('SELECT id, name, url, icon, category, tags FROM links WHERE user = ? ORDER BY id')

function addLink(name, url, user) {
  insertLinks.run(name, url, user)
}

function setLinkIcon(id, icon) {
  updateLinkIcon.run({id, icon})
}

function setLinkCategory(id, category) {
  updateLinkCategory.run({id, category})
}

function setLinkTags(id, tags) {
  updateLinkTags.run({id, tags})
}

function getLinks(userId) {
  return linksByUser.all(userId)
}

// addUser('hjh', 'test@somedomain.com', '')

// addLink('vg.no', 'https://www.vg.no', 1)
// addLink('gmail', 'https://mail.google.com', 1)

// const remove = db.prepare('DELETE FROM links WHERE id = 3 OR id = 4')
// remove.run()

console.log('user', getUserById(1))
console.log('links', getLinks(1))

export {
  addUser,
  setUserDetails,
  removeUser,
  getUserByEmail,
  
  getCategories,

  addLink,
  setLinkIcon,
  setLinkCategory,
  setLinkTags,
  getLinks
}

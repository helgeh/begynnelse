
export async function run(db, config) {

  const log = config.logger || console.log

  log('Seeding DB...')

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
  //   log('update links failed')
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

  const userResult = db.prepare('INSERT INTO users (name, email, password, details) VALUES (?, ?, ?, ?)')
    .run('hjh', process.env.ADMIN_EMAIL, process.env.ADMIN_PW, `et:CONFIRMED-${Date.now()};`)
  log('  Added user with id ' + userResult.lastInsertRowid)
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
  
  log('    Done seeding DB!')

  return true

}

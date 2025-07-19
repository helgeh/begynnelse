import fs from 'fs/promises'
import path from 'path'
import parser from 'xml2json'


export default function configure(router) {


  router.get('/podcasts', function (req, res, next) {
    const mp3Dir = path.join(path.resolve(), 'public', 'mp3')
    const result = []
    fs.readdir(mp3Dir)
      .then(async (files) => {
        const dirs = []
        for (let i = 0; i < files.length; i++) {
          const stat = await fs.lstat(path.join(mp3Dir, files[i]))
          if (stat.isDirectory()) dirs.push(files[i])
        }
        return dirs
      })
      .then((dirs) =>
        dirs.map((dir) => ({
          path: path.join('/mp3', dir),
          slug: dir,
          episodes: [],
        })),
      )
      .then((dirs) => res.json({ dirs }))
  })

  router.get('/podcasts/:slug/episodes', async function (req, res, next) {
    const slug = req.params.slug
    const showDir = path.join(path.resolve(), 'public', 'mp3', slug)
    try {
      const showStat = await fs.lstat(showDir)
      if (!showStat.isDirectory()) return res.send(404)
      fs.readdir(showDir)
        .then((files) => files.filter((file) => /.mp3$/.test(file)))
        .then((files) =>
          files.map((file) => ({
            path: path.join('/mp3', slug, file),
            fileName: file,
          })),
        )
        .then((files) => res.json({ files }))
    } catch (ex) {
      return res.status(404).send({ files: [] })
    }
  })

  router.get('/rss', function (req, res, next) {
    res.json({ dirs: Object.keys(xmlMap).map((k) => ({ slug: k })) })
  })

  router.get('/rss/:slug/episodes', async function (req, res, next) {
    const slug = req.params.slug

    const xmlData = xmlMap[slug]
    if (!xmlData || xmlData.length < 1) return res.status(404).send('Not found')

    const xmlFile = fs
      .readFile(path.resolve(`./src/server/xml/${slug}.xml`), 'utf8')
      .then((file) => {
        const json = parser.toJson(file)
        res.json({
          files: JSON.parse(json)
            .rss.item.map((item) => ({
              path: item.enclosure.url,
              fileName: item.title,
              image: item['itunes:image'].href,
            }))
            .reverse(),
        })
      })
      .catch((err) => {
        console.log(err)
        return res.status(404).send({ files: [] })
      })
  })



  const xmlMap = {
    rbeai: 'Roger Bullman - Etterlyst av Interpol',
    kak: 'Kongen av Kongsberg',
    tom: 'Torpedoen og Milliardæren',
    stdmeb: 'Skyldig til det motsatte er bevist',
  }

}

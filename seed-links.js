const links = [
  {
    "url": "https://mail.proton.me",
    "name": "Proton.mail",
    "icon": "https://favicone.com/mail.proton.me?s=32",
    "category": "common",
    "tags": "email,proton,pri1,standard"
  },
  {
    "url": "https://pass.proton.me",
    "name": "Proton.pass",
    "icon": "https://favicone.com/pass.proton.me?s=32",
    "category": "common",
    "tags": "passwords,proton,pri1,standard"
  },
  {
    "url": "https://github.com/helgeh",
    "name": "Github",
    "icon": {
      "light": "/icons/github-light-32x32.png",
      "dark": "/icons/github-dark-32x32.png"
    },
    "category": "develop",
    "tags": "code,git,pri1,standard"
  },
  {
    "url": "https://cloud.linode.com/linodes/46503355",
    "name": "Linode",
    "icon": "https://favicone.com/cloud.linode.com?s=32",
    "category": "common",
    "tags": "web-host,linode,pri1,standard"
  },
  {
    "url": "https://bsky.app",
    "name": "Bluesky",
    "icon": "https://favicone.com/bsky.app?s=32",
    "category": "common",
    "tags": "social,bsky,pri1,standard"
  },
  {
    "url": "https://archlinux.org",
    "name": "Arch",
    "icon": "https://favicone.com/archlinux.org?s=32",
    "category": "common",
    "tags": "os,arch,pri1,standard"
  },
  {
    "url": "https://xcancel.com",
    "name": "Xcancel",
    "icon": "https://favicone.com/xcancel.com?s=32",
    "category": "common",
    "tags": "social,xcancel,pri1,standard"
  },
  {
    "url": "https://duckduckgo.com",
    "name": "duckduckgo",
    "icon": "https://favicone.com/duckduckgo.com?s=32",
    "category": "common",
    "tags": "search,duckduckgo,pri1,standard"
  },
  {
    "url": "https://minecraft.wiki",
    "name": "MC.wiki",
    "icon": "https://favicone.com/minecraft.wiki?s=32",
    "category": "entertain",
    "tags": "minecraft,wiki,pri2,gaming"
  },
  {
    "url": "https://www.chunkbase.com",
    "name": "Chunkbase",
    "icon": "https://favicone.com/chunkbase.com?s=32",
    "category": "entertain",
    "tags": "minecraft,map,chunkbase,pri2,gaming"
  },
  {
    "url": "https://modrinth.com",
    "name": "Modrinth",
    "icon": "https://favicone.com/modrinth.com?s=32",
    "category": "entertain",
    "tags": "minecraft,mods,modrinth,pri2,gaming"
  },
  {
    "url": "https://vanillatweaks.net",
    "name": "VanillaTweaks",
    "icon": "https://favicone.com/vanillatweaks.net?s=32",
    "category": "entertain",
    "tags": "minecraft,vanillatweaks,pri2,gaming"
  },
  {
    "url": "https://legacy.curseforge.com/minecraft/mc-mods",
    "name": "Curseforge",
    "icon": "https://favicone.com/curseforge.com?s=32",
    "category": "entertain",
    "tags": "minecraft,mods,curseforge,pri2,gaming"
  },
  {
    "url": "https://fabricmc.net",
    "name": "Fabric",
    "icon": "https://favicone.com/fabricmc.net?s=32",
    "category": "entertain",
    "tags": "minecraft,mods,fabric,pri2,gaming"
  },
  {
    "url": "https://www.digminecraft.com/",
    "name": "DigMC",
    "icon": "https://favicone.com/www.digminecraft.com?s=32",
    "category": "entertain",
    "tags": "minecraft,digminecraft,pri2,gaming"
  },
  {
    "url": "https://www.planetminecraft.com/",
    "name": "PlanetMC",
    "icon": "https://favicone.com/www.planetminecraft.com?s=32",
    "category": "entertain",
    "tags": "minecraft,planetminecraft,pri2,gaming"
  },
  {
    "url": "https://satisfactory.wiki.gg/wiki/Satisfactory_Wiki",
    "name": "Satisf.wiki",
    "icon": "https://favicone.com/satisfactory.wiki.gg?s=32",
    "category": "entertain",
    "tags": "satisfactory,wiki,pri2,gaming"
  },
  {
    "url": "https://satisfactory-calculator.com/en/planners/production",
    "name": "Satisf.calc",
    "icon": "/icons/satisfactory-calculator-32x32.png",
    "category": "entertain",
    "tags": "satisfactory,calculator,pri2,gaming"
  },
  {
    "url": "https://scramble.cubing.net",
    "name": "Cube.Scrambler",
    "icon": "https://favicone.com/scramble.cubing.net?s=32",
    "category": "entertain",
    "tags": "scramble,rubiks,pri2,cubing"
  },
  {
    "url": "https://timer.cubing.net",
    "name": "Cube.Timer",
    "icon": "https://favicone.com/timer.cubing.net?s=32",
    "category": "entertain",
    "tags": "timer,rubiks,pri2,cubing"
  },
  {
    "url": "https://stackoverflow.com",
    "name": "Stackoverflow",
    "icon": "https://favicone.com/stackoverflow.com?s=32",
    "category": "develop",
    "tags": "qna,stackoverflow,pri3,dev"
  },
  {
    "url": "https://domene.shop",
    "name": "Domeneshop",
    "icon": "https://domene.shop/favicon/76x76.png",
    "category": "develop",
    "tags": "hosting,domeneshop,pri3,dev"
  },
  {
    "url": "https://vuejs.org",
    "name": "Vue.js",
    "icon": "https://favicone.com/vuejs.org?s=32",
    "category": "develop",
    "tags": "js,vue,pri3,dev"
  },
  {
    "url": "https://vuetifyjs.com",
    "name": "Vuetify",
    "icon": "https://favicone.com/vuetifyjs.com?s=32",
    "category": "develop",
    "tags": "js,vuetify,pri3,dev"
  },
  {
    "url": "https://pinia.vuejs.org",
    "name": "Pinia",
    "icon": "https://favicone.com/pinia.vuejs.org?s=32",
    "category": "develop",
    "tags": "js,pinia,pri3,dev"
  },
  {
    "url": "https://getbootstrap.com",
    "name": "Bootstrap",
    "icon": "https://favicone.com/getbootstrap.com?s=32",
    "category": "develop",
    "tags": "css,bootstrap,pri3,dev"
  },
  {
    "url": "https://lodash.com/docs",
    "name": "Lodash",
    "icon": "https://favicone.com/lodash.com?s=32",
    "category": "develop",
    "tags": "js,lodash,pri3,dev"
  },
  {
    "url": "https://jsbin.com/",
    "name": "JsBin",
    "icon": "https://favicone.com/jsbin.com?s=32",
    "category": "develop",
    "tags": "online,jsbin,pri3,dev"
  },
  {
    "url": "https://solcigar.no/",
    "name": "Solcigar",
    "icon": "/icons/solcigar-57x57.png",
    "category": "common",
    "tags": "solcigar,pri4,shopping"
  },
  {
    "url": "https://www.nespresso.com/no/nb",
    "name": "Nespresso",
    "icon": "https://favicone.com/nespresso.com?s=32",
    "category": "common",
    "tags": "nespresso,pri4,shopping"
  },
  {
    "url": "https://www.komplett.no",
    "name": "Komplett",
    "icon": "https://favicone.com/www.komplett.no?s=32",
    "category": "common",
    "tags": "data,komplett,pri4,shopping"
  },
  {
    "url": "https://www.dustinhome.no",
    "name": "Dustinhome",
    "icon": "/icons/dustinhome-32x32.png",
    "category": "common",
    "tags": "data,dustinhome,pri4,shopping"
  },
  {
    "url": "https://begy.nnel.se",
    "name": "begy",
    "icon": "/icons/begynnelse-32x32.png",
    "category": "develop",
    "tags": "begynnelse,pri5,mysites"
  },
  {
    "url": "https://admin-blokkda.nnel.se/letsplay",
    "name": "admin-blokkda",
    "icon": "/icons/adminblokkda.svg",
    "category": "develop",
    "tags": "admin-blokkda,pri5,mysites"
  },
  {
    "url": "https://proxy-ante.nnel.se",
    "name": "proxy-ante",
    "icon": "/icons/proxyantennelse-32x32.png",
    "category": "develop",
    "tags": "proxy-ante,nxginx,pri5,mysites"
  },
  {
    "url": "https://font-bete.nnel.se",
    "name": "font-bete",
    "icon": "/icons/fontbetennelse.svg",
    "category": "develop",
    "tags": "font-bete,foxpublish,pri5,mysites"
  },
  {
    "url": "https://pyrofoniks.no/",
    "name": "Pyrofoniks",
    "icon": "https://pyrofoniks.no/favicon.ico",
    "category": "develop",
    "tags": "web,pyrofoniks,pri5,mysites"
  },
  {
    "url": "https://leonlingua.com",
    "name": "Leonlingua",
    "icon": "/icons/leonlingua-32x32.png",
    "category": "develop",
    "tags": "leonlingua,wordpress,pri5,mysites"
  },
  {
    "url": "https://sonixmadnezz.com",
    "name": "Sonixmadnezz",
    "icon": "",
    "category": "develop",
    "tags": "sonixmadnezz,wordpress,pri5,mysites"
  },
  {
    "url": "https://youtube.com",
    "name": "Youtube",
    "icon": "https://favicone.com/youtube.com?s=32",
    "category": "entertain",
    "tags": "video,youtube,pri6,media"
  },
  {
    "url": "https://tv.nrk.no",
    "name": "NRK.tv",
    "icon": "/icons/nrk-tv-32x32.png",
    "category": "entertain",
    "tags": "video,nrk,pri6,media"
  },
  {
    "url": "https://radio.nrk.no",
    "name": "NRK.radio",
    "icon": "/icons/nrk-radio-32x32.png",
    "category": "entertain",
    "tags": "radio,nrk,pri6,media"
  },
  {
    "url": "https://netflix.com",
    "name": "Netflix",
    "icon": "https://favicone.com/netflix.com?s=32",
    "category": "entertain",
    "tags": "video,netflix,pri6,media"
  },
  {
    "url": "https://music.youtube.com/",
    "name": "yt.Music",
    "icon": "https://favicone.com/music.youtube.com?s=32",
    "category": "entertain",
    "tags": "music,youtube,pri6,media"
  },
  {
    "url": "https://vimeo.com",
    "name": "Vimeo",
    "icon": "https://favicone.com/vimeo.com?s=32",
    "category": "entertain",
    "tags": "video,vimeo,pri6,media"
  },
  {
    "url": "https://twitch.tv",
    "name": "Twitch",
    "icon": "https://favicone.com/twitch.tv?s=32",
    "category": "entertain",
    "tags": "streaming,twitch,pri6,media"
  },
  {
    "url": "https://openstreetmap.org",
    "name": "OpenStreetMap",
    "icon": "/icons/openstreetmap-32x32.png",
    "category": "utility",
    "tags": "map,openstreetmap,pri7,utils"
  },
  {
    "url": "https://norgeskart.no/",
    "name": "Norgeskart",
    "icon": "/icons/norgeskart.ico",
    "category": "utility",
    "tags": "map,norgeskart,pri7,utils"
  },
  {
    "url": "https://www.imdb.com/",
    "name": "Imdb",
    "icon": "https://favicone.com/imdb.com?s=32",
    "category": "utility",
    "tags": "movies,imdb,pri7,utils"
  }
]

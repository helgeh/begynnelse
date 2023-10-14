import webFontLoader from 'webfontloader'
export function loadFonts () {
  webFontLoader.load({
    google: {
      families: [
        'Josefin Sans:100,300,400,500,700,900&display=swap', 
        'Roboto:100,300,400,500,700,900&display=swap'
      ],
    },
  })
}

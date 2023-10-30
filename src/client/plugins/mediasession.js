
export default {
    install(app, options) {


        const actionHandlers = [
            ['play',          () => { if (callbacks['play']) callbacks['play']() }],
            ['pause',         () => { if (callbacks['pause']) callbacks['pause']() }],
            ['previoustrack', () => { if (callbacks['previoustrack']) callbacks['previoustrack']() }],
            ['nexttrack',     () => { if (callbacks['nexttrack']) callbacks['nexttrack']() }],
            ['stop',          null],//() => { /* ... */ }],
            ['seekbackward',  (details) => { if (callbacks['seekbackward']) callbacks['seekbackward'](details) }],
            ['seekforward',   (details) => { if (callbacks['seekforward']) callbacks['seekforward'](details) }],
            ['seekto',        null],//(details) => { /* ... */ }],
            /* Video conferencing actions */
            ['togglemicrophone', null],//() => { /* ... */ }],
            ['togglecamera',     null],//() => { /* ... */ }],
            ['hangup',           null],//() => { /* ... */ }],
            /* Presenting slides actions */
            ['previousslide', null],//() => { /* ... */ }],
            ['nextslide',     null],//() => { /* ... */ }],
        ]

        for (const [action, handler] of actionHandlers) {
            try {
                navigator.mediaSession.setActionHandler(action, handler)
            }
            catch (error) {
                console.log(`The media session action "${action}" is not supported yet.`)
            }
        }

        const callbacks = {
            play: null,
            pause: null,
            previoustrack: null,
            nexttrack: null,
            seekbackward: null,
            seekforward: null
        }

        app.provide('mediasession', {

            setCallback: function (key, cb) {
                if (Object.keys(callbacks).indexOf(key) >= 0)
                    callbacks[key] = cb
            },

            setMetadata: async (data) => {
                
                // After media (video or audio) starts playing
                // await document.querySelector("video").play();
                try {
                    if ("mediaSession" in navigator) {
                        navigator.mediaSession.metadata = new MediaMetadata({
                            title: data.track,
                            artist: data.podcast,
                            // album: data.show,
                            // artwork: [
                            //     { src: 'https://via.placeholder.com/96',   sizes: '96x96',   type: 'image/png' },
                            //     { src: 'https://via.placeholder.com/128', sizes: '128x128', type: 'image/png' },
                            //     { src: 'https://via.placeholder.com/192', sizes: '192x192', type: 'image/png' },
                            //     { src: 'https://via.placeholder.com/256', sizes: '256x256', type: 'image/png' },
                            //     { src: 'https://via.placeholder.com/384', sizes: '384x384', type: 'image/png' },
                            //     { src: 'https://via.placeholder.com/512', sizes: '512x512', type: 'image/png' },
                            // ]
                        })
                        // TODO: Update playback state.
                    }
                }
                catch (ex) {
                    console.log('Failed to set metadata for mediasession')
                }
            },

        })
    }
}
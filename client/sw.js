// Choose a cache name
const cacheName = 'cache-v1'

// List the files to precache
const precacheResources = [
  './',
  './index.html',
  './main.css',
  './manifest.json',
  './assets/logo/128.png',
  './assets/logo/192.png',
  './assets/logo/256.png',
  './assets/logo/384.png',
  './assets/logo/512.png',
  './assets/vignette.png',
  './assets/mainMenu/mainST.mp3',
  './assets/fonts/PressStart2P.ttf',
  './assets/fonts/VT323.ttf',
  './assets/battleMatch/forest.png',
  './assets/battleMatch/spark.png',
  './assets/cardsBg/white.png',
  './assets/mainMenu/cloud.png',
  './assets/mainMenu/creditsButton.png',
  './assets/mainMenu/door.png',
  './assets/mainMenu/filter.png',
  './assets/mainMenu/fog.png',
  './assets/mainMenu/mountains.png',
  './assets/mainMenu/playButton.png',
  './assets/mainMenu/sky.png',
  './assets/roomLobby/bgPorta.png',
  './assets/roomLobby/createRoom.png',
  './assets/roomLobby/enterRoom.png',
  './assets/settings/bg.png',
  './assets/settings/closeIcon.png',
  './assets/settings/gear.png',
  './assets/bg-img.png',
  './assets/cardsSprites/aFenix.png',
  './assets/cardsSprites/ameacaVulcanica.png',
  './assets/cardsSprites/anaoRobusto.png',
  './assets/cardsSprites/anomaliaEspinhosa.png',
  './assets/cardsSprites/arautoAnciao.png',
  './assets/cardsSprites/arqueiroAeromante.png',
  './assets/cardsSprites/arqueiroNovico.png',
  './assets/cardsSprites/aSentença.png',
  './assets/cardsSprites/barbaroErudito.png',
  './assets/cardsSprites/basiliscoSombrio.png',
  './assets/cardsSprites/bestaInfernal.png',
  './assets/cardsSprites/cavaleiroErudito.png',
  './assets/cardsSprites/cavaleiroRedimido.png',
  './assets/cardsSprites/chamaViva.png',
  './assets/cardsSprites/ciclope.png',
  './assets/cardsSprites/colossoDeGelo.png',
  './assets/cardsSprites/damaAudaciosa.png',
  './assets/cardsSprites/dragaoAureo.png',
  './assets/cardsSprites/dragaoNovico.png',
  './assets/cardsSprites/dragaoPenumbra.png',
  './assets/cardsSprites/dragaoTurquesa.png',
  './assets/cardsSprites/elementalDeBarro.png',
  './assets/cardsSprites/elfaProdigio.png',
  './assets/cardsSprites/fadaGotaDagua.png',
  './assets/cardsSprites/fagulha.png',
  './assets/cardsSprites/feiticeiraAprendiz.png',
  './assets/cardsSprites/felinoChicote.png',
  './assets/cardsSprites/giganteLorde.png',
  './assets/cardsSprites/golemDeMagma.png',
  './assets/cardsSprites/grifoRastreador.png',
  './assets/cardsSprites/guardiaoArvore.png',
  './assets/cardsSprites/homemMorcego.png',
  './assets/cardsSprites/ignicornio.png',
  './assets/cardsSprites/komainu.png',
  './assets/cardsSprites/licantropoOculto.png',
  './assets/cardsSprites/minotauroCarmesim.png',
  './assets/cardsSprites/observador.png',
  './assets/cardsSprites/oExecutor.png',
  './assets/cardsSprites/ogroAcogueiro.png',
  './assets/cardsSprites/ogroMacico.png',
  './assets/cardsSprites/pequenoBrotinho.png',
  './assets/cardsSprites/puxaCovas.png',
  './assets/cardsSprites/símioDasNeves.png',
  './assets/cardsSprites/tribalRastreador.png',
  './assets/cardsSprites/trollLiberto.png',
  './js/scenes/battleMatch.js',
  './js/scenes/claimCredits.js',
  './js/scenes/logoEntry.js',
  './js/scenes/mainMenu.js',
  './js/scenes/playersLobby.js',
  './js/scenes/roomLobby.js',
  './js/axios.min.js',
  './js/Card.js',
  './js/cardList.js',
  './js/config.js',
  './js/index.js',
  './js/phaser.min.js',
  './js/settingsMenu.js'
]

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
  console.log('Service worker install event!')
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)))
})

self.addEventListener('activate', (event) => {
  console.log('Service worker activate event!')
})

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request)
    })
  )
})

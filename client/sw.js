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
  './assets/mainMenu/mainST.mp3',
  './assets/fonts/PressStart2P.ttf',
  './assets/fonts/VT323.ttf',
  './assets/battleBg/forest.png',
  './assets/battleBg/spark.png',
  './assets/battleBg/whiteVignette.png',
  './assets/cardsBg/white.png',
  './assets/cardsSprites/testSprite.png',
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
  './js/scenes/battleMatch.js',
  './js/scenes/claimCredits.js',
  './js/scenes/logoEntry.js',
  './js/scenes/mainMenu.js',
  './js/scenes/playersLobby.js',
  './js/scenes/roomLobby.js',
  './js/axios.min.js',
  './js/Cards.js',
  './js/cardList.js',
  './js/config.js',
  './js/manifest.json',
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

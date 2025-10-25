const CACHE_NAME = "monkey-math-cache-v5";
const FILES_TO_CACHE = [
  "./", "./index.html", "./style.css", "./game.js", "./manifest.webmanifest",
  "./background.png", "./menu_background.png", "./score_background.png",
  "./monkey_idle.png", "./monkey_blink.png", "./basket.png", "./banana.png",
  "./background_music.wav", "./correct.wav", "./wrong.ogg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)));
});

self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request).then(r => r || fetch(event.request)));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
  ));
});

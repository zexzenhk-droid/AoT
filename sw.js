/* 

// REGRA DE SEGURANÇA PARA STREAMING DO INTERNET ARCHIVE (ERRO 206)
self.addEventListener('fetch', event => {
  if (event.request.url.includes('archive.org') || event.request.url.endsWith('.mp3')) {
    return event.respondWith(fetch(event.request));
  }
});

AOT Engenheiro — service worker (offline)

/* 
AOT Engenheiro — service worker (offline)
   ------------------------------------------------------------
   Estratégia:
   • CORE (app shell)  → cache-first (rápido, offline)
   • JSON e playlists  → network-first (sempre versão nova)
   • MP3s              → cache-first (grandes, não mudam)
   • Imagens           → cache-first
   ------------------------------------------------------------
   IMPORTANTE: sempre que actualizares ficheiros, incrementa
   o número da versão. Isso força o telemóvel a apagar o
   cache antigo e a descarregar tudo de novo. */
const CACHE = 'aot-eng-v2';       // Fase 3 — sistema de versão

const CORE = [
  './','index.html','style.css','unidades.html','manual.html','manifest.json',
  'js/i18n.js','js/temas.js','js/aircraft.js','js/unidades.js','js/limites.js',
  'js/conhecimento.js','js/missoes.js','js/dialogo.js','js/radio.js','js/app.js',
  'img/splash.jpg'
];

const IDS = ['p51','p47','p63','p40','sb2c','sbd','f4u','bf109f','fw190','bf109g','bf110',
  'yak9t','la5fn','yak3','il2','spitfirevb','spitfireia','typhoon','firefly',
  'mosquito','hurricane','a6m3','ki61','j2m2','d4y3','dr1','dvii','camel','spadsxiii'];

/* Ficheiros que devem ir SEMPRE à rede primeiro
   (para apanhar actualizações imediatamente) */
const SEMPRE_FRESCO = [
  'playlists.json',
  'version.json'
];

/* ---------- INSTALL ---------- */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(CORE.concat(IDS.map(i => `img/${i}.jpg`))).catch(() => {})
    ).then(() => self.skipWaiting())
  );
});

/* ---------- ACTIVATE (limpa caches antigos) ---------- */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks =>
      Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* ---------- FETCH (estratégia inteligente) ---------- */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;

  /* 1. JSON e ficheiros de configuração → NETWORK FIRST
        (garante que playlists actualizadas chegam sempre) */
  if (SEMPRE_FRESCO.some(f => url.includes(f))) {
    e.respondWith(
      fetch(e.request).then(resp => {
        if (resp.ok) {
          const cl = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, cl));
        }
        return resp;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  /* 2. Tudo o resto → CACHE FIRST (rápido, offline) */
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      if (resp.ok && url.startsWith(self.location.origin)) {
        const cl = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, cl));
      }
      return resp;
    }).catch(() => caches.match('index.html')))
  );
});

/* Service Worker: hält die App auf dem Gerät, damit sie auch ohne Netz startet.
   Seite: erst Netz (für Updates), bei fehlendem Netz aus dem Speicher.
   Bibliotheken, Schriften, Symbole: aus dem Speicher, im Hintergrund aktualisiert.
   Kartenkacheln werden nicht gespeichert (Karte braucht Internet). */
const VERSION = 'gm-wartung-71';
const GRUNDDATEIEN = ['./', './index.html', './manifest.webmanifest', './apple-touch-icon.png', './icon-192.png', './icon-512.png', './favicon-32.png', './briefbogen.jpg'];
const FREMDE_QUELLEN = ['https://cdnjs.cloudflare.com/', 'https://fonts.googleapis.com/', 'https://fonts.gstatic.com/'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(GRUNDDATEIEN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('gm-wartung-') && k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

async function erstNetz(req){
  const cache = await caches.open(VERSION);
  try{
    const antwort = await Promise.race([fetch(req), new Promise((_, rej) => setTimeout(() => rej(new Error('zu langsam')), 4000))]);
    if(antwort.ok) cache.put('./index.html', antwort.clone());
    return antwort;
  }catch(err){
    return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
  }
}

async function erstSpeicher(req){
  const cache = await caches.open(VERSION);
  const gespeichert = await cache.match(req);
  const neu = fetch(req).then(antwort => { if(antwort.ok || antwort.type === 'opaque') cache.put(req, antwort.clone()); return antwort; }).catch(() => null);
  return gespeichert || (await neu) || Response.error();
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(req.mode === 'navigate' && url.origin === location.origin) { e.respondWith(erstNetz(req)); return; }
  if(url.origin === location.origin && !url.pathname.endsWith('daten.bin')) { e.respondWith(erstSpeicher(req)); return; }
  if(FREMDE_QUELLEN.some(q => req.url.startsWith(q))) { e.respondWith(erstSpeicher(req)); return; }
});

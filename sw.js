const V="afghanaid-v2";
const FILES=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// اول از اینترنت (نسخه تازه)، اگر نبود یا کند بود از حافظه
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
 e.respondWith((async()=>{const c=await caches.open(V);
  try{const r=await Promise.race([fetch(e.request,{cache:"no-cache"}),new Promise((_,j)=>setTimeout(j,3000))]);
   if(r&&r.ok){c.put(e.request,r.clone());return r}}catch(x){}
  const hit=await c.match(e.request,{ignoreSearch:true});
  return hit||fetch(e.request)})())});

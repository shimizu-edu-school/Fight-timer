const CACHE_VERSION = 'v1';
const CACHE_NAME = `fight-timer-${CACHE_VERSION}`;

// インストール時にキャッシュを作成
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([const CACHE_VERSION = 'v2';
const CACHE_NAME = `fight-timer-${CACHE_VERSION}`;

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ネットワーク優先：常に最新版を取得し、オフライン時のみキャッシュを使う
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).then(response => {
      if (response && response.status === 200) {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
      }
      return response;
    }).catch(() => {
      return caches.match(event.request);
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

        './',
        './index.html',
        './manifest.json'
      ]).catch(err => {
        console.log('キャッシュ失敗:', err);
        // キャッシュが失敗しても続行
      });
    }).then(() => self.skipWaiting())
  );
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// フェッチイベントの処理
self.addEventListener('fetch', event => {
  // GETリクエストのみ処理
  if (event.request.method !== 'GET') {
    return;
  }

  // キャッシュから取得、無ければネットワークから取得
  event.respondWith(
    caches.match(event.request).then(response => {
      // キャッシュがあればそれを返す
      if (response) {
        return response;
      }

      // キャッシュがなければネットワークから取得
      return fetch(event.request).then(response => {
        // ネットワークエラーの場合はここに到達しない
        // ステータスコードが200でない場合もキャッシュしない
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // レスポンスをクローンしてキャッシュに追加
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // ネットワークエラーの場合、キャッシュがあればそれを返す
        return caches.match(event.request).then(response => {
          return response || new Response('オフラインです', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      });
    })
  );
});

// メッセージリスナー（キャッシュ更新チェック用）
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

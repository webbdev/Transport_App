var CACHE_NAME = 'public-transportation-app-cashe-v1';

self.addEventListener('install', function(event) {
  // pre cache a load of stuff:
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/templates/main.htm',
        '/templates/holidayservice.htm',
        '/templates/pdf.htm',
        '/css/combined.css',
        '/js/combined.js',
        '/json/caltrain-data.json',
        '/bower_components/angular/angular.js',
        '/bower_components/angular-route/angular-route.js',
        '/bower_components/angular-resource/angular-resource.js',
        '/bower_components/jquery/dist/jquery.js',
        '/bower_components/bootstrap/dist/js/bootstrap.min.js',
        '/bower_components/bootstrap/dist/css/bootstrap.min.css',
        '/pdf/Weekday-Southbound.pdf',
        '/pdf/Weekday-Northbound.pdf',
        '/pdf/Weekend-Schedule.pdf',
        '/pdf/Full-Timetable.pdf',
        '/images/favicon.png',
        '/images/map.png',
        'https://fonts.googleapis.com/css?family=Roboto:400,300italic,300,100,100italic,400italic,500,500italic,700,700italic,900,900italic&subset=latin,cyrillic-ext'
      ]);
    }).then(function() {
      console.log('[sw] static files cached!');
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('public-transport-app') &&
                  cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      console.log('[sw] All the old caches has been deleted');
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
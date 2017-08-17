//cria
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('sw.js');
	});
}

//instala
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
	'index.html',
	'js.js',
	'css.css'
];
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function(cache) {
			return cache.addAll(urlsToCache);
		})
	);
});

//limṕa cache antigo
self.addEventListener('activate', function(event) {
	var cacheWhitelist = ['pages-cache-v1', 'blog-posts-cache-v1'];
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.map(function(cacheName) {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

//Usa cache ou salva novo arquivo
self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			if (response) {
				return response;
			}
			var fetchRequest = event.request.clone();
			return fetch(fetchRequest).then(function(response) {
				if(!response || response.status !== 200 || response.type !== 'basic') {
					return response;
				}
				var responseToCache = response.clone();
				caches.open(CACHE_NAME).then(function(cache) {
					cache.put(event.request, responseToCache);
				});
				return response;
			});
		})
	);
});

//Push
function subscribe() {
	pushButton.disabled = true;
	navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
		serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true }).then(function(subscription) {
			isPushEnabled = true;
			$('pushButton').textContent = 'Desabilitar notificações';
			$('pushButton').disabled = false;
		}).catch(function(e) {
			if(Notification.permission === 'denied') {
				$('pushButton').disabled = true;
			} else {
				$('pushButton').disabled = false;
				$('pushButton').textContent = 'Notificações ativadas';
			}
		});
	});
}
self.addEventListener('push', function(event) {  
  var title = 'Titulo';  
  var body = 'Você recebeu uma notificaçao de push';  
  var icon = 'icon.png';  
  var tag = 'exemplo-simples-push';
  event.waitUntil(  
    self.registration.showNotification(title, {  
      body: body,  
      icon: icon,  
      tag: tag  
    })  
  );  
});
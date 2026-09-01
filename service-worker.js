// Suba esse número toda vez que a lista de arquivos abaixo mudar, pra
// forçar os clientes a buscar a versão nova.
const CACHE_NOME = "openmind-cache-v5";

// NOTA: esta lista ainda vai crescer nas próximas etapas (progress.html,
// profile.html, simulator.html + seus css/js) — por enquanto só o que
// já existe.
const ARQUIVOS_PARA_CACHE = [
    "./index.html",
    "./css/style.css",
    "./js/script.js",
    "./js/utils.js",
    "./js/firebase-config.js",
    "./js/language.js",
    "./js/data/subjects.js",
    "./js/data/vocabulary.js",
    "./js/data/questions.js",
    "./js/data/translations.js",
    "./js/subjects-service.js",
    "./js/questions-service.js",
    "./js/adaptive-service.js",
    "./js/vocabulary-service.js",
    "./manifest.json",
    "./css/nav-lateral.css",

    "./pages/dashboard.html",
    "./css/dashboard.css",
    "./js/dashboard.js",

    "./pages/subjects.html",
    "./css/subjects.css",
    "./js/subjects.js",

    "./pages/training.html",
    "./css/training.css",
    "./js/training.js",

    "./pages/vocabulary.html",
    "./css/vocabulary.css",
    "./js/vocabulary.js",

    "./pages/historico.html",
    "./css/historico.css",
    "./js/historico.js",

    "./pages/configuracoes.html",
    "./css/configuracoes.css",
    "./js/configuracoes.js",

    "./img/icons/icon-192.png",
    "./img/icons/icon-512.png"
];

// Instala o service worker e guarda os arquivos em cache
self.addEventListener("install", (evento) => {

    evento.waitUntil(
        caches.open(CACHE_NOME).then((cache) => {
            return cache.addAll(ARQUIVOS_PARA_CACHE);
        })
    );

    self.skipWaiting();
});

// Remove caches antigos quando uma nova versão é instalada
self.addEventListener("activate", (evento) => {

    evento.waitUntil(
        caches.keys().then((nomes) => {
            return Promise.all(
                nomes
                    .filter((nome) => nome !== CACHE_NOME)
                    .map((nome) => caches.delete(nome))
            );
        })
    );

    self.clients.claim();
});

// Serve pelo cache primeiro; se não tiver, busca na rede
self.addEventListener("fetch", (evento) => {

    evento.respondWith(
        caches.match(evento.request).then((respostaCache) => {
            return respostaCache || fetch(evento.request);
        })
    );
});

// ---------------- NOTIFICAÇÕES (lembretes) ----------------
// O dashboard.js dispara notificações locais chamando
// registration.showNotification(...) diretamente (não é push de
// servidor). Esse handler só cuida do clique: ao tocar na notificação,
// abre o app já no Dashboard (ou foca a aba se já estiver aberta).
self.addEventListener("notificationclick", (evento) => {

    evento.notification.close();

    evento.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((listaClients) => {

            for (const cliente of listaClients) {
                if (cliente.url.includes("dashboard.html") && "focus" in cliente) {
                    return cliente.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow("./pages/dashboard.html");
            }
        })
    );
});

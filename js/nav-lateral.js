// Menu lateral compartilhado por todas as páginas internas do app.
// Em vez de duplicar o HTML do menu em cada página, esse script injeta
// tudo sozinho: o botão de hambúrguer no cabeçalho e o painel lateral
// com a lista de seções — e também o seletor de idioma (🇧🇷/🇺🇸), já que
// o drawer é a única coisa presente em toda página interna.

import { t, obterIdioma, definirIdioma } from "./language.js";
import { auth } from "./firebase-config.js";

const PAGINAS = [
    { arquivo: "dashboard.html", icone: "🏠", chave: "nav.home" },
    { arquivo: "training.html", icone: "🎯", chave: "nav.training" },
    { arquivo: "subjects.html", icone: "📚", chave: "nav.subjects" },
    { arquivo: "simulator.html", icone: "📝", chave: "nav.simulator" },
    { arquivo: "vocabulary.html", icone: "🔤", chave: "nav.vocabulary" },
    { arquivo: "progress.html", icone: "📊", chave: "nav.progress" },
    { arquivo: "historico.html", icone: "📜", chave: "nav.history" },
    { arquivo: "configuracoes.html", icone: "👤", chave: "nav.profile" }
];

function iniciar() {

    const cabecalho = document.querySelector("header");
    if (!cabecalho) return;

    const paginaAtual = window.location.pathname.split("/").pop();

    // ---------------- BOTÃO HAMBÚRGUER ----------------

    const botaoMenu = document.createElement("button");
    botaoMenu.type = "button";
    botaoMenu.className = "botao-menu";
    botaoMenu.setAttribute("aria-label", "Abrir menu");
    botaoMenu.innerHTML =
        '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';

    cabecalho.appendChild(botaoMenu);

    // ---------------- PAINEL LATERAL ----------------

    const overlay = document.createElement("div");
    overlay.className = "overlay-menu";

    const drawer = document.createElement("aside");
    drawer.className = "drawer-menu";

    const itensHtml = PAGINAS.map(pg => {
        const ativo = pg.arquivo === paginaAtual ? " ativo" : "";
        return (
            '<a href="' + pg.arquivo + '" class="item-drawer' + ativo + '">' +
                '<span>' + pg.icone + '</span>' +
                '<span>' + t(pg.chave) + '</span>' +
            '</a>'
        );
    }).join("");

    const idiomaAtual = obterIdioma();

    drawer.innerHTML =
        '<div class="drawer-topo">' +
            '<div class="drawer-marca">' +
                '<img src="../img/logo.png" alt="OpenMind" class="logo-drawer">' +
                '<h2>OpenMind</h2>' +
            '</div>' +
            '<button type="button" class="fechar-drawer" aria-label="Fechar menu">✕</button>' +
        '</div>' +
        '<div class="drawer-idioma">' +
            '<span class="drawer-idioma-rotulo">' + t("language.label") + '</span>' +
            '<div class="seletor-idioma">' +
                '<button type="button" class="opcao-idioma' + (idiomaAtual === "pt" ? " ativo" : "") + '" data-idioma="pt">🇧🇷 PT</button>' +
                '<button type="button" class="opcao-idioma' + (idiomaAtual === "en" ? " ativo" : "") + '" data-idioma="en">🇺🇸 EN</button>' +
            '</div>' +
        '</div>' +
        '<nav class="drawer-lista">' + itensHtml + '</nav>' +
        '<button type="button" class="item-drawer item-sair" id="botaoSairDrawer">' +
            '<span>⏻</span><span>' + (idiomaAtual === "en" ? "Log out" : "Sair") + '</span>' +
        '</button>';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    function abrirMenu() {
        drawer.classList.add("aberto");
        overlay.classList.add("aberto");
    }

    function fecharMenu() {
        drawer.classList.remove("aberto");
        overlay.classList.remove("aberto");
    }

    botaoMenu.addEventListener("click", abrirMenu);
    overlay.addEventListener("click", fecharMenu);
    drawer.querySelector(".fechar-drawer").addEventListener("click", fecharMenu);

    drawer.querySelectorAll(".opcao-idioma").forEach(botao => {
        botao.addEventListener("click", () => {
            const uid = auth.currentUser?.uid || null;
            definirIdioma(botao.getAttribute("data-idioma"), uid);
            window.location.reload();
        });
    });

    drawer.querySelector("#botaoSairDrawer").addEventListener("click", () => {
        fecharMenu();
        if (typeof window.sair === "function") {
            window.sair();
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
} else {
    iniciar();
}

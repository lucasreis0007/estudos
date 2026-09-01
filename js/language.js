// ---------------- IDIOMA ----------------
// Único lugar que decide o idioma atual. Guardado em localStorage (pra
// funcionar instantaneamente, sem esperar o Firestore) e também no
// perfil do usuário (pra persistir entre dispositivos). Nenhuma página
// controla idioma por conta própria — todas chamam estas funções.

import { salvarPerfil } from "./utils.js";
import { TRANSLATIONS } from "./data/translations.js";

const CHAVE_LOCAL = "openmind_idioma";

export function obterIdioma() {
    return localStorage.getItem(CHAVE_LOCAL) || "pt";
}

export function definirIdioma(idioma, uid = null) {
    localStorage.setItem(CHAVE_LOCAL, idioma);
    if (uid) salvarPerfil(uid, { language: idioma });
}

// Chamado uma vez ao carregar cada página: se o perfil (Firestore) diz
// um idioma diferente do que está salvo localmente (ex: usuário trocou
// de idioma em outro aparelho), o local é atualizado.
export function sincronizarIdiomaComPerfil(perfil) {
    if (perfil?.language && perfil.language !== obterIdioma()) {
        localStorage.setItem(CHAVE_LOCAL, perfil.language);
    }
}

// Tradução de uma string de interface fixa (chave do dicionário).
// Aceita um segundo parâmetro opcional para substituir {placeholders}.
export function t(chave, substituicoes = {}) {
    const idioma = obterIdioma();
    let texto = TRANSLATIONS[idioma]?.[chave] ?? TRANSLATIONS.pt[chave] ?? chave;

    Object.entries(substituicoes).forEach(([nome, valor]) => {
        texto = texto.replace(`{${nome}}`, valor);
    });

    return texto;
}

// Escolhe o campo certo de um objeto bilíngue (ex: {namePt, nameEn} ou
// {questionPt, questionEn}) de acordo com o idioma atual. `prefixo` é a
// parte antes de "Pt"/"En" (ex: "name", "question", "explicacao").
export function campoIdioma(objeto, prefixo) {
    const idioma = obterIdioma();
    const chave = idioma === "en" ? `${prefixo}En` : `${prefixo}Pt`;
    return objeto?.[chave] ?? objeto?.[`${prefixo}Pt`] ?? "";
}

// Aplica t() em todo elemento com [data-i18n] já presente no HTML
// estático da página — chamar depois que o DOM carregou.
export function aplicarTraducoes() {
    document.querySelectorAll("[data-i18n]").forEach(elemento => {
        elemento.textContent = t(elemento.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(elemento => {
        elemento.setAttribute("placeholder", t(elemento.getAttribute("data-i18n-placeholder")));
    });
}

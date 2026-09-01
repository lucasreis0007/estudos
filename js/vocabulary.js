import { protegerPagina, carregarPerfil } from "./utils.js";
import { garantirMateriasSemeadas, listarMaterias } from "./subjects-service.js";
import {
    garantirVocabularioSemeado,
    listarVocabulario,
    palavrasPorMateria,
    obterProgressoVocabulario,
    estatisticasVocabulario,
    montarFilaPratica,
    registrarRespostaVocabulario
} from "./vocabulary-service.js";
import { t, campoIdioma, sincronizarIdiomaComPerfil, aplicarTraducoes } from "./language.js";

const parametros = new URLSearchParams(window.location.search);
const materiaInicial = parametros.get("materia") || "";

let usuario = null;
let materiaAtual = materiaInicial;

// Estado do modo prática
let filaPratica = [];
let indicePratica = 0;
let acertosPratica = 0;

iniciar();

async function iniciar() {

    usuario = await protegerPagina();
    const perfil = await carregarPerfil(usuario.uid);
    sincronizarIdiomaComPerfil(perfil);
    aplicarTraducoes();

    await Promise.all([garantirMateriasSemeadas(), garantirVocabularioSemeado()]);

    await preencherFiltroMaterias();
    await renderizarEstatisticas();
    await renderizarLista();

    document.getElementById("seletorMateria").addEventListener("change", async (evento) => {
        materiaAtual = evento.target.value;
        await renderizarLista();
    });

    document.getElementById("btnIniciarPratica").addEventListener("click", iniciarPratica);
    document.getElementById("btnMostrarTraducao").addEventListener("click", revelarTraducao);
    document.getElementById("btnSabia").addEventListener("click", () => responderPratica(true));
    document.getElementById("btnNaoSabia").addEventListener("click", () => responderPratica(false));
    document.getElementById("btnSairPratica").addEventListener("click", encerrarPratica);
    document.getElementById("btnVoltarLista").addEventListener("click", encerrarPratica);
}

// ---------------- ESTATÍSTICAS ----------------

async function renderizarEstatisticas() {
    const stats = await estatisticasVocabulario(usuario.uid);
    document.getElementById("statTotal").textContent = stats.total;
    document.getElementById("statDominadas").textContent = stats.mastered;
    document.getElementById("statAprendendo").textContent = stats.learning;
    document.getElementById("statRevisar").textContent = stats.review;
}

// ---------------- FILTRO POR MATÉRIA ----------------
// As opções vêm de listarMaterias() — nenhuma matéria fica hardcoded
// aqui, igual ao resto do app. O "value" de cada opção é o subjectId,
// que é o mesmo id usado como "category" no banco de vocabulário.

async function preencherFiltroMaterias() {

    const materias = await listarMaterias();
    const seletor = document.getElementById("seletorMateria");

    materias.forEach(materia => {
        const opcao = document.createElement("option");
        opcao.value = materia.id;
        opcao.textContent = campoIdioma(materia, "name");
        if (materia.id === materiaInicial) opcao.selected = true;
        seletor.appendChild(opcao);
    });
}

// ---------------- LISTA DE PALAVRAS ----------------

async function renderizarLista() {

    const [palavras, progresso] = await Promise.all([
        materiaAtual ? palavrasPorMateria(materiaAtual) : listarVocabulario(),
        obterProgressoVocabulario(usuario.uid)
    ]);

    const container = document.getElementById("listaPalavras");

    if (palavras.length === 0) {
        container.innerHTML = `<p class="carregando" data-i18n="vocabulary.noWords">Nenhuma palavra cadastrada para esta matéria ainda.</p>`;
        aplicarTraducoes();
        return;
    }

    container.innerHTML = palavras.map(palavra => {
        const registro = progresso[palavra.id];
        return `
        <div class="card-palavra">
            <div class="palavra-topo">
                <div>
                    <div class="palavra-ingles">${palavra.english}</div>
                    <div class="palavra-portugues">${palavra.portuguese}</div>
                </div>
                <span class="palavra-status">${iconeStatusPalavra(registro)}</span>
            </div>
            <div class="palavra-exemplos">
                🇺🇸 ${palavra.exampleEn}<br>
                🇧🇷 ${palavra.examplePt}
            </div>
        </div>
    `;
    }).join("");
}

function iconeStatusPalavra(registro) {
    if (!registro) return "⚪";
    if (new Date(registro.nextReview) <= new Date()) return "🔴";
    if ((registro.mastery || 0) >= 4) return "🟢";
    return "🟡";
}

// ---------------- MODO PRÁTICA (flashcards) ----------------

async function iniciarPratica() {

    filaPratica = await montarFilaPratica(usuario.uid, { subjectId: materiaAtual || null, limite: 15 });
    indicePratica = 0;
    acertosPratica = 0;

    document.getElementById("viewLista").classList.add("oculto");
    document.getElementById("viewFimPratica").classList.add("oculto");

    if (filaPratica.length === 0) {
        document.getElementById("viewSemPratica").classList.remove("oculto");
        return;
    }

    document.getElementById("viewSemPratica").classList.add("oculto");
    document.getElementById("viewPratica").classList.remove("oculto");

    renderizarFlashcard();
}

function renderizarFlashcard() {

    const palavra = filaPratica[indicePratica];

    document.getElementById("contadorPratica").textContent =
        t("vocabulary.wordOf", { atual: indicePratica + 1, total: filaPratica.length });

    document.getElementById("barraProgressoPratica").style.width =
        `${Math.round((indicePratica / filaPratica.length) * 100)}%`;

    document.getElementById("flashcardCategoria").textContent = palavra.category;
    document.getElementById("flashcardPalavra").textContent = palavra.english;
    document.getElementById("flashcardTraducao").textContent = palavra.portuguese;
    document.getElementById("flashcardExemploEn").textContent = `🇺🇸 ${palavra.exampleEn}`;
    document.getElementById("flashcardExemploPt").textContent = `🇧🇷 ${palavra.examplePt}`;

    document.getElementById("flashcardFrente").classList.remove("oculto");
    document.getElementById("flashcardVerso").classList.add("oculto");
}

function revelarTraducao() {
    document.getElementById("flashcardFrente").classList.add("oculto");
    document.getElementById("flashcardVerso").classList.remove("oculto");
}

async function responderPratica(sabia) {

    const palavra = filaPratica[indicePratica];
    if (sabia) acertosPratica++;

    await registrarRespostaVocabulario(usuario.uid, palavra.id, sabia);

    indicePratica++;

    if (indicePratica < filaPratica.length) {
        renderizarFlashcard();
    } else {
        finalizarPratica();
    }
}

async function finalizarPratica() {

    document.getElementById("viewPratica").classList.add("oculto");
    document.getElementById("viewFimPratica").classList.remove("oculto");

    document.getElementById("resumoPratica").textContent =
        t("vocabulary.practiceSummary", { acertos: acertosPratica, total: filaPratica.length });

    await renderizarEstatisticas();
}

async function encerrarPratica() {
    document.getElementById("viewPratica").classList.add("oculto");
    document.getElementById("viewFimPratica").classList.add("oculto");
    document.getElementById("viewSemPratica").classList.add("oculto");
    document.getElementById("viewLista").classList.remove("oculto");
    await renderizarEstatisticas();
    await renderizarLista();
}

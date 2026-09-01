import { protegerPagina, carregarPerfil } from "./utils.js";
import {
    garantirMateriasSemeadas,
    listarMaterias,
    buscarMateria,
    listarTopicos,
    adicionarMateria,
    adicionarTopico
} from "./subjects-service.js";
import { obterProgressoTodasMaterias, statusMateria } from "./adaptive-service.js";
import { t, campoIdioma, obterIdioma, sincronizarIdiomaComPerfil, aplicarTraducoes } from "./language.js";

const parametros = new URLSearchParams(window.location.search);
const materiaSelecionada = parametros.get("materia");

let usuarioAtual = null;

iniciar();

async function iniciar() {

    usuarioAtual = await protegerPagina();
    const perfil = await carregarPerfil(usuarioAtual.uid);
    sincronizarIdiomaComPerfil(perfil);
    aplicarTraducoes();

    await garantirMateriasSemeadas();

    if (materiaSelecionada) {
        await mostrarTopicos(materiaSelecionada);
    } else {
        await mostrarMaterias();
    }
}

// ---------------- VISÃO: LISTA DE MATÉRIAS ----------------

async function mostrarMaterias() {

    document.getElementById("viewTopicos").classList.add("oculto");
    document.getElementById("viewMaterias").classList.remove("oculto");
    document.getElementById("tituloPagina").textContent = t("subjects.title");
    document.getElementById("subtituloPagina").textContent = t("subjects.subtitle");

    const [materias, progressoPorMateria] = await Promise.all([
        listarMaterias(),
        obterProgressoTodasMaterias(usuarioAtual.uid)
    ]);

    const grid = document.getElementById("gridMaterias");

    grid.innerHTML = materias.map(materia => {
        const status = statusMateria(progressoPorMateria[materia.id]);
        const rotuloStatus = status.chave ? t(status.chave) : t("dashboard.notStarted");
        return `
        <a href="subjects.html?materia=${materia.id}" class="card-materia-completo">
            <div class="card-materia-topo">
                <span class="card-materia-icone" style="background:${materia.color}22;color:${materia.color};">⚙️</span>
                <div>
                    <div class="card-materia-nome">${campoIdioma(materia, "name")}</div>
                    <div class="card-materia-status">${rotuloStatus}</div>
                </div>
            </div>
            <div class="barra-progresso">
                <div class="barra-progresso-preenchimento" style="width:${status.percentual}%;"></div>
            </div>
        </a>
    `;
    }).join("");

    ligarFormularioMateria();
}

function ligarFormularioMateria() {

    const botaoMostrar = document.getElementById("btnMostrarFormMateria");
    const form = document.getElementById("formMateria");
    const botaoCancelar = document.getElementById("btnCancelarMateria");

    botaoMostrar.addEventListener("click", () => form.classList.remove("oculto"));
    botaoCancelar.addEventListener("click", () => form.classList.add("oculto"));

    form.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        await adicionarMateria({
            namePt: document.getElementById("materiaNomePt").value.trim(),
            nameEn: document.getElementById("materiaNomeEn").value.trim(),
            descriptionPt: document.getElementById("materiaDescricao").value.trim()
        });

        form.reset();
        form.classList.add("oculto");
        mostrarMaterias();
    });
}

// ---------------- VISÃO: ASSUNTOS DE UMA MATÉRIA ----------------

async function mostrarTopicos(subjectId) {

    document.getElementById("viewMaterias").classList.add("oculto");
    document.getElementById("viewTopicos").classList.remove("oculto");

    const materia = await buscarMateria(subjectId);

    if (!materia) {
        window.location.href = "subjects.html";
        return;
    }

    document.getElementById("tituloPagina").textContent = campoIdioma(materia, "name");
    document.getElementById("subtituloPagina").textContent =
        obterIdioma() === "en" ? materia.namePt : materia.nameEn;

    const topicos = await listarTopicos(subjectId);
    const container = document.getElementById("listaTopicos");

    container.innerHTML = topicos.length
        ? topicos.map(topico => {
            const nomePrincipal = campoIdioma(topico, "name");
            const nomeSecundario = obterIdioma() === "en" ? topico.namePt : topico.nameEn;
            return `
            <div class="card-topico">
                <div>
                    <div class="topico-nome">${nomePrincipal}</div>
                    <div class="topico-nome-en">${nomeSecundario}</div>
                </div>
                <span class="pill-dificuldade pill-${topico.difficulty || 'basic'}">
                    ${rotuloDificuldade(topico.difficulty)}
                </span>
            </div>
        `;
        }).join("")
        : `<p class="carregando">${t("subjects.noTopics")}</p>`;

    document.getElementById("btnTreinarMateria").addEventListener("click", () => {
        window.location.href = `training.html?materia=${subjectId}`;
    });

    ligarFormularioTopico(subjectId);
}

function rotuloDificuldade(dificuldade) {
    const chaves = { basic: "difficulty.basic", intermediate: "difficulty.intermediate", advanced: "difficulty.advanced" };
    return t(chaves[dificuldade] || chaves.basic);
}

function ligarFormularioTopico(subjectId) {

    const botaoMostrar = document.getElementById("btnMostrarFormTopico");
    const form = document.getElementById("formTopico");
    const botaoCancelar = document.getElementById("btnCancelarTopico");

    botaoMostrar.addEventListener("click", () => form.classList.remove("oculto"));
    botaoCancelar.addEventListener("click", () => form.classList.add("oculto"));

    form.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        await adicionarTopico(subjectId, {
            namePt: document.getElementById("topicoNomePt").value.trim(),
            nameEn: document.getElementById("topicoNomeEn").value.trim(),
            descriptionPt: document.getElementById("topicoDescricao").value.trim(),
            difficulty: document.getElementById("topicoDificuldade").value
        });

        form.reset();
        form.classList.add("oculto");
        mostrarTopicos(subjectId);
    });
}

import { protegerPagina } from "./utils.js";
import {
    garantirMateriasSemeadas,
    listarMaterias,
    buscarMateria,
    listarTopicos,
    adicionarMateria,
    adicionarTopico
} from "./subjects-service.js";

const parametros = new URLSearchParams(window.location.search);
const materiaSelecionada = parametros.get("materia");

iniciar();

async function iniciar() {

    await protegerPagina();
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
    document.getElementById("tituloPagina").textContent = "📚 Matérias";
    document.getElementById("subtituloPagina").textContent = "Escolha uma matéria para estudar";

    const materias = await listarMaterias();
    const grid = document.getElementById("gridMaterias");

    grid.innerHTML = materias.map(materia => `
        <a href="subjects.html?materia=${materia.id}" class="card-materia-completo">
            <div class="card-materia-topo">
                <span class="card-materia-icone" style="background:${materia.color}22;color:${materia.color};">⚙️</span>
                <div>
                    <div class="card-materia-nome">${materia.namePt}</div>
                    <div class="card-materia-status">Ainda não iniciado</div>
                </div>
            </div>
            <div class="barra-progresso">
                <div class="barra-progresso-preenchimento" style="width:0%;"></div>
            </div>
        </a>
    `).join("");

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

    document.getElementById("tituloPagina").textContent = `${materia.namePt}`;
    document.getElementById("subtituloPagina").textContent = materia.nameEn;

    const topicos = await listarTopicos(subjectId);
    const container = document.getElementById("listaTopicos");

    container.innerHTML = topicos.length
        ? topicos.map(topico => `
            <div class="card-topico">
                <div>
                    <div class="topico-nome">${topico.namePt}</div>
                    <div class="topico-nome-en">${topico.nameEn}</div>
                </div>
                <span class="pill-dificuldade pill-${topico.difficulty || 'basic'}">
                    ${rotuloDificuldade(topico.difficulty)}
                </span>
            </div>
        `).join("")
        : `<p class="carregando">Nenhum assunto cadastrado ainda nesta matéria.</p>`;

    document.getElementById("btnTreinarMateria").addEventListener("click", () => {
        window.location.href = `training.html?materia=${subjectId}`;
    });

    ligarFormularioTopico(subjectId);
}

function rotuloDificuldade(dificuldade) {
    const rotulos = { basic: "🟢 Basic", intermediate: "🟡 Intermediate", advanced: "🔴 Advanced" };
    return rotulos[dificuldade] || rotulos.basic;
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

import { protegerPagina, carregarPerfil } from "../js/utils.js";
import { garantirMateriasSemeadas, listarMaterias } from "../js/subjects-service.js";
import { VOCABULARY } from "../js/data/vocabulary.js";

iniciar();

async function iniciar() {

    const usuario = await protegerPagina();
    const perfil = await carregarPerfil(usuario.uid);

    await garantirMateriasSemeadas();

    renderizarSaudacao(perfil);
    renderizarEstatisticas(perfil);
    renderizarRecomendacao(perfil);
    await renderizarMaterias();
    renderizarIngles();

    document.getElementById("btnIniciarTreino").addEventListener("click", () => {
        window.location.href = "training.html";
    });
}

// ---------------- SAUDAÇÃO ----------------

function renderizarSaudacao(perfil) {

    const hora = new Date().getHours();
    let saudacao;

    if (hora < 12) saudacao = "Good morning";
    else if (hora < 18) saudacao = "Good afternoon";
    else saudacao = "Good evening";

    const nome = perfil.name ? `, ${perfil.name}` : "";
    document.getElementById("saudacao").textContent = `${saudacao}${nome}`;
}

// ---------------- ESTATÍSTICAS ----------------

function renderizarEstatisticas(perfil) {

    document.getElementById("statStreak").textContent = perfil.streak;
    document.getElementById("statXp").textContent = perfil.xp;
    document.getElementById("statNivel").textContent = perfil.level;
    document.getElementById("statExercicios").textContent = perfil.exercisesDone;

    const taxaAcertos = perfil.exercisesDone > 0
        ? Math.round((perfil.correctAnswers / perfil.exercisesDone) * 100) + "%"
        : "--";

    document.getElementById("statAcertos").textContent = taxaAcertos;
}

// ---------------- RECOMENDAÇÃO (baseada em dados reais) ----------------
// Nesta etapa ainda não existem exercícios/sessões registrados (isso
// entra nas etapas 5 e 6), então a única coisa que já sabemos de verdade
// é se o usuário já treinou alguma vez ou não. A lógica de "você está
// indo bem em X" / "precisa revisar Y" é plugada aqui assim que o motor
// de exercícios e o sistema de revisão existirem — nunca com números
// inventados.

function renderizarRecomendacao(perfil) {

    const texto = perfil.exercisesDone > 0
        ? "Continue de onde parou — vamos manter sua sequência de estudos."
        : "Você ainda não fez nenhum treino. Que tal começar agora com sua primeira sessão de 60 minutos?";

    document.getElementById("textoRecomendacao").textContent = texto;
}

// ---------------- MATÉRIAS ----------------
// Lista genérica a partir de js/data/subjects.js — nenhuma matéria está
// hardcoded aqui. O progresso por matéria (dominado/em desenvolvimento)
// passa a ser real quando o sistema de exercícios existir (etapa 5/6);
// por enquanto mostramos o estado real: "ainda não iniciado".

async function renderizarMaterias() {

    const container = document.getElementById("listaMaterias");
    const materias = await listarMaterias();

    container.innerHTML = materias.map(materia => `
        <a href="subjects.html?materia=${materia.id}" class="card-materia">
            <span class="materia-icone" style="background:${materia.color}22;color:${materia.color};">⚙️</span>
            <div class="materia-info">
                <div class="materia-nome">${materia.namePt}</div>
                <div class="materia-status">Ainda não iniciado</div>
            </div>
        </a>
    `).join("");
}

// ---------------- TECHNICAL ENGLISH ----------------
// O total de palavras é real (tamanho do banco de vocabulário). Domínio
// e revisão dependem da coleção vocabularyProgress, que ainda não existe
// (entra na etapa 8) — por isso começam em 0, não inventados.

function renderizarIngles() {
    document.getElementById("vocabTotal").textContent = VOCABULARY.length;
    document.getElementById("vocabDominadas").textContent = 0;
    document.getElementById("vocabRevisar").textContent = 0;
}

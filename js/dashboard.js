import { protegerPagina, carregarPerfil } from "../js/utils.js";
import { garantirMateriasSemeadas, listarMaterias } from "../js/subjects-service.js";
import { obterProgressoTodasMaterias, statusMateria } from "../js/adaptive-service.js";
import { VOCABULARY } from "../js/data/vocabulary.js";
import { t, campoIdioma, sincronizarIdiomaComPerfil, aplicarTraducoes } from "../js/language.js";

iniciar();

async function iniciar() {

    const usuario = await protegerPagina();
    const perfil = await carregarPerfil(usuario.uid);

    sincronizarIdiomaComPerfil(perfil);
    aplicarTraducoes();

    await garantirMateriasSemeadas();

    const [materias, progressoPorMateria] = await Promise.all([
        listarMaterias(),
        obterProgressoTodasMaterias(usuario.uid)
    ]);

    renderizarSaudacao(perfil);
    renderizarEstatisticas(perfil);
    renderizarRecomendacao(perfil, materias, progressoPorMateria);
    renderizarMaterias(materias, progressoPorMateria);
    renderizarIngles();

    document.getElementById("btnIniciarTreino").addEventListener("click", () => {
        window.location.href = "training.html";
    });
}

// ---------------- SAUDAÇÃO ----------------

function renderizarSaudacao(perfil) {

    const hora = new Date().getHours();
    let chaveSaudacao;

    if (hora < 12) chaveSaudacao = "dashboard.greetingMorning";
    else if (hora < 18) chaveSaudacao = "dashboard.greetingAfternoon";
    else chaveSaudacao = "dashboard.greetingEvening";

    const nome = perfil.name ? `, ${perfil.name}` : "";
    document.getElementById("saudacao").textContent = `${t(chaveSaudacao)}${nome}`;
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
// Usa o mesmo progresso adaptativo que decide a dificuldade dos
// exercícios: se alguma matéria está "🔴 Precisa revisar", avisa o
// usuário; senão, uma mensagem neutra baseada em ter treinado ou não.
// Nunca um texto ou número fixo/aleatório.

function renderizarRecomendacao(perfil, materias, progressoPorMateria) {

    const materiaParaRevisar = materias
        .map(materia => ({ materia, status: statusMateria(progressoPorMateria[materia.id]) }))
        .find(item => item.status.cor === "vermelho");

    let texto;

    if (materiaParaRevisar) {
        const nomeMateria = campoIdioma(materiaParaRevisar.materia, "name");
        texto = `${t("dashboard.needsReview")} ${nomeMateria}.`;
    } else if (perfil.exercisesDone > 0) {
        texto = t("dashboard.keepGoing");
    } else {
        texto = t("dashboard.noTrainingYet");
    }

    document.getElementById("textoRecomendacao").textContent = texto;
}

// ---------------- MATÉRIAS ----------------
// Lista genérica a partir do Firestore — nenhuma matéria está hardcoded
// aqui. Status e barra de progresso vêm do sistema adaptativo (progresso
// real por tópico/dificuldade). Nome e status já saem no idioma atual.

function renderizarMaterias(materias, progressoPorMateria) {

    const container = document.getElementById("listaMaterias");

    container.innerHTML = materias.map(materia => {
        const status = statusMateria(progressoPorMateria[materia.id]);
        const rotuloStatus = status.chave ? t(status.chave) : t("dashboard.notStarted");
        return `
        <a href="subjects.html?materia=${materia.id}" class="card-materia">
            <span class="materia-icone" style="background:${materia.color}22;color:${materia.color};">⚙️</span>
            <div class="materia-info">
                <div class="materia-nome">${campoIdioma(materia, "name")}</div>
                <div class="materia-status">${rotuloStatus}</div>
            </div>
        </a>
    `;
    }).join("");
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

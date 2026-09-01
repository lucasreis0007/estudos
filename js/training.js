import { protegerPagina, carregarPerfil, salvarPerfil } from "./utils.js";
import { garantirExerciciosSemeados, buscarLoteExercicios, registrarResposta } from "./questions-service.js";
import { atualizarProgressoTopico } from "./adaptive-service.js";
import { t, campoIdioma, obterIdioma, sincronizarIdiomaComPerfil, aplicarTraducoes } from "./language.js";

const parametros = new URLSearchParams(window.location.search);
const subjectId = parametros.get("materia");

let usuario = null;
let perfil = null;
let exercicios = [];
let indiceAtual = 0;
let acertos = 0;
const inicioSessao = Date.now();
let inicioQuestao = Date.now();

iniciar();

async function iniciar() {

    usuario = await protegerPagina();
    perfil = await carregarPerfil(usuario.uid);

    sincronizarIdiomaComPerfil(perfil);
    aplicarTraducoes();

    await garantirExerciciosSemeados();
    exercicios = await buscarLoteExercicios({ subjectId, uid: usuario.uid, quantidade: 10 });

    if (exercicios.length === 0) {
        document.getElementById("viewVazio").classList.remove("oculto");
        document.getElementById("contadorQuestao").textContent = t("training.noneAvailable");
        return;
    }

    document.getElementById("btnProxima").addEventListener("click", proximaQuestao);
    document.getElementById("viewQuestao").classList.remove("oculto");

    renderizarQuestao();
}

function renderizarQuestao() {

    const exercicio = exercicios[indiceAtual];
    inicioQuestao = Date.now();

    document.getElementById("contadorQuestao").textContent =
        t("training.questionOf", { atual: indiceAtual + 1, total: exercicios.length });

    document.getElementById("barraProgresso").style.width =
        `${Math.round((indiceAtual / exercicios.length) * 100)}%`;

    const pill = document.getElementById("pillDificuldade");
    pill.className = `pill-dificuldade pill-${exercicio.difficulty || 'basic'}`;
    pill.textContent = rotuloDificuldade(exercicio.difficulty);

    document.getElementById("textoQuestao").textContent = campoIdioma(exercicio, "question");

    const listaOpcoes = document.getElementById("listaOpcoes");
    listaOpcoes.innerHTML = "";

    const idioma = obterIdioma() === "en" ? "En" : "Pt";
    const opcoes = exercicio[`options${idioma}`] || exercicio.optionsPt;

    opcoes.forEach((opcao, indice) => {
        const botao = document.createElement("button");
        botao.className = "opcao";
        botao.textContent = opcao;
        botao.addEventListener("click", () => responder(indice));
        listaOpcoes.appendChild(botao);
    });

    document.getElementById("painelCorrecao").classList.add("oculto");
}

function responder(indiceEscolhido) {

    const exercicio = exercicios[indiceAtual];
    const correta = indiceEscolhido === exercicio.correta;
    const tempoMs = Date.now() - inicioQuestao;

    if (correta) acertos++;

    // Trava as opções e destaca visualmente a certa/errada — o gabarito
    // só aparece DEPOIS da resposta, nunca antes.
    const botoes = document.querySelectorAll(".opcao");
    botoes.forEach((botao, indice) => {
        botao.disabled = true;
        if (indice === exercicio.correta) botao.classList.add("correta");
        else if (indice === indiceEscolhido) botao.classList.add("incorreta");
    });

    document.getElementById("resultadoCorrecao").textContent = correta ? t("training.correct") : t("training.incorrect");
    document.getElementById("resultadoCorrecao").style.color = correta ? "#166534" : "#991B1B";
    document.getElementById("explicacaoCorrecao").textContent = campoIdioma(exercicio, "explicacao");
    document.getElementById("painelCorrecao").classList.remove("oculto");

    registrarResposta(usuario.uid, { exercicio, respostaIndice: indiceEscolhido, correta, tempoMs });
    atualizarProgressoTopico(usuario.uid, {
        subjectId: exercicio.subjectId,
        topicId: exercicio.topicId,
        difficulty: exercicio.difficulty,
        correta
    }).catch(erro => console.error("Erro ao atualizar progresso adaptativo:", erro));
}

function proximaQuestao() {
    indiceAtual++;
    if (indiceAtual < exercicios.length) {
        renderizarQuestao();
    } else {
        finalizarTreino();
    }
}

async function finalizarTreino() {

    document.getElementById("viewQuestao").classList.add("oculto");
    document.getElementById("barraProgresso").style.width = "100%";

    const total = exercicios.length;
    const xpGanho = acertos * 10;
    const duracaoMin = Math.max(1, Math.round((Date.now() - inicioSessao) / 60000));

    await salvarPerfil(usuario.uid, {
        exercisesDone: (perfil.exercisesDone || 0) + total,
        correctAnswers: (perfil.correctAnswers || 0) + acertos,
        xp: (perfil.xp || 0) + xpGanho,
        totalStudyTime: (perfil.totalStudyTime || 0) + duracaoMin
    });

    document.getElementById("resumoResultado").innerHTML =
        t("training.summaryResult", { acertos, total }) + "<br>" + t("training.xpEarned", { xp: xpGanho });

    document.getElementById("viewResultado").classList.remove("oculto");
}

function rotuloDificuldade(dificuldade) {
    const chaves = { basic: "difficulty.basic", intermediate: "difficulty.intermediate", advanced: "difficulty.advanced" };
    return t(chaves[dificuldade] || chaves.basic);
}

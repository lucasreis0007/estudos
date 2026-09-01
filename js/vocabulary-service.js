// ---------------- SERVIÇO DE VOCABULÁRIO TÉCNICO ----------------
// Mesmo padrão de subjects-service.js / questions-service.js: a UI
// (vocabulary.js, dashboard.js, training.js) nunca lê js/data/vocabulary.js
// nem conhece uma palavra específica — ela só chama estas funções.
//
// Duas coleções no Firestore:
//   "vocabulary"         → o banco de palavras (semeado uma vez a partir
//                           de js/data/vocabulary.js, igual matérias/exercícios).
//   "vocabularyProgress" → UMA linha por (usuário, palavra), com o
//                           histórico de acertos/erros daquele usuário
//                           naquela palavra. É daqui que vem "dominada",
//                           "aprendendo" e "revisar" — nunca de um número
//                           fixo.
//
// Observação importante: as categorias do banco de vocabulário (ex:
// "motores", "manutencao", "usinagem"...) usam os MESMOS ids das
// matérias (subjectId) — não por coincidência, mas para que uma palavra
// possa ser associada à matéria certa sem precisar de um campo novo nem
// de nenhum "if" por matéria.

import { db, collection, doc, getDoc, setDoc, getDocs, query, where } from "./firebase-config.js";
import { VOCABULARY as VOCABULARIO_PADRAO } from "./data/vocabulary.js";

const COLECAO_VOCABULARIO = "vocabulary";
const COLECAO_PROGRESSO = "vocabularyProgress";

// Níveis de domínio (0 a 5) → intervalo de revisão espaçada, em dias.
// Regra simples pedida no roadmap: acerto aumenta o intervalo; erro
// reduz o nível e volta a palavra para revisão em breve (mesmo dia).
const INTERVALOS_DIAS = [0, 1, 3, 7, 14, 30];
const NIVEL_DOMINIO_MINIMO = 4;

function idProgresso(uid, vocabularyId) {
    return `${uid}_${vocabularyId}`;
}

// ---------------- BANCO DE PALAVRAS ----------------

// Semeia a coleção "vocabulary" uma única vez (mesmo padrão de
// garantirMateriasSemeadas / garantirExerciciosSemeados).
export async function garantirVocabularioSemeado() {

    const instantaneo = await getDocs(collection(db, COLECAO_VOCABULARIO));
    if (!instantaneo.empty) return;

    for (const palavra of VOCABULARIO_PADRAO) {
        await setDoc(doc(db, COLECAO_VOCABULARIO, palavra.id), {
            english: palavra.english,
            portuguese: palavra.portuguese,
            category: palavra.category,
            examplePt: palavra.examplePt,
            exampleEn: palavra.exampleEn,
            difficulty: palavra.difficulty
        });
    }
}

export async function listarVocabulario() {
    const instantaneo = await getDocs(collection(db, COLECAO_VOCABULARIO));
    return instantaneo.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Palavras de uma categoria — usada tanto pela tela de Technical English
// (filtro por matéria) quanto pelo treino (vocabulário relacionado à
// matéria do exercício que acabou de ser respondido).
export async function palavrasPorMateria(subjectId) {
    const todas = await listarVocabulario();
    return todas.filter(palavra => palavra.category === subjectId);
}

// ---------------- PROGRESSO DO USUÁRIO ----------------

export async function obterProgressoVocabulario(uid) {
    const q = query(collection(db, COLECAO_PROGRESSO), where("userId", "==", uid));
    const instantaneo = await getDocs(q);
    const porPalavra = {};
    instantaneo.docs.forEach(d => { porPalavra[d.data().vocabularyId] = d.data(); });
    return porPalavra;
}

// Registra o resultado de uma rodada de prática (acertou / não sabia) e
// recalcula nível de domínio + próxima revisão. Chamado pela tela
// Technical English no modo prática — nunca durante o treino normal,
// que só EXIBE o vocabulário relacionado, sem cobrar resposta.
export async function registrarRespostaVocabulario(uid, vocabularyId, correta) {

    const referencia = doc(db, COLECAO_PROGRESSO, idProgresso(uid, vocabularyId));
    const instantaneo = await getDoc(referencia);
    const atual = instantaneo.exists() ? instantaneo.data() : { correct: 0, incorrect: 0, mastery: 0 };

    const mastery = correta
        ? Math.min((atual.mastery || 0) + 1, INTERVALOS_DIAS.length - 1)
        : Math.max((atual.mastery || 0) - 1, 0);

    const agora = new Date();
    const proximaRevisao = new Date(agora);
    proximaRevisao.setDate(proximaRevisao.getDate() + (correta ? INTERVALOS_DIAS[mastery] : 0));

    await setDoc(referencia, {
        userId: uid,
        vocabularyId,
        correct: (atual.correct || 0) + (correta ? 1 : 0),
        incorrect: (atual.incorrect || 0) + (correta ? 0 : 1),
        mastery,
        nextReview: proximaRevisao.toISOString(),
        updatedAt: agora.toISOString()
    }, { merge: true });
}

// Monta a fila de prática: primeiro as palavras já vistas que estão
// vencidas (nextReview no passado), depois palavras nunca praticadas —
// até o limite pedido. É assim que a tela de Technical English decide
// por onde começar a sessão de prática, sem repetir o que o usuário já
// domina e ainda não venceu.
export async function montarFilaPratica(uid, { subjectId = null, limite = 15 } = {}) {

    const [todasPalavras, progresso] = await Promise.all([
        subjectId ? palavrasPorMateria(subjectId) : listarVocabulario(),
        obterProgressoVocabulario(uid)
    ]);

    const agora = new Date();

    const vencidas = [];
    const novas = [];

    todasPalavras.forEach(palavra => {
        const registro = progresso[palavra.id];
        if (!registro) {
            novas.push(palavra);
        } else if (new Date(registro.nextReview) <= agora) {
            vencidas.push({ palavra, nextReview: registro.nextReview });
        }
    });

    vencidas.sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview));

    const fila = [...vencidas.map(item => item.palavra), ...embaralhar(novas)];
    return fila.slice(0, limite);
}

// Estatísticas para o dashboard e para o topo da tela Technical English.
// Cada palavra cai em exatamente um balde — nunca inventado, sempre
// derivado do progresso real:
//   mastered  → nível de domínio alto e ainda não venceu.
//   review    → tem progresso e está vencida (precisa revisar agora).
//   learning  → tudo o mais (nunca praticada, ou em andamento).
export async function estatisticasVocabulario(uid) {

    const [todasPalavras, progresso] = await Promise.all([
        listarVocabulario(),
        obterProgressoVocabulario(uid)
    ]);

    const agora = new Date();
    let dominadas = 0;
    let revisar = 0;

    todasPalavras.forEach(palavra => {
        const registro = progresso[palavra.id];
        if (!registro) return;

        const vencida = new Date(registro.nextReview) <= agora;
        if (vencida) revisar++;
        else if ((registro.mastery || 0) >= NIVEL_DOMINIO_MINIMO) dominadas++;
    });

    const aprendendo = Math.max(0, todasPalavras.length - dominadas - revisar);

    return { total: todasPalavras.length, mastered: dominadas, review: revisar, learning: aprendendo };
}

function embaralhar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

// ---------------- SERVIÇO DE EXERCÍCIOS ----------------
// Mesma lógica de subjects-service.js: a UI nunca lê js/data/questions.js
// diretamente nem sabe o conteúdo de uma pergunta específica. Ela pede
// "me dá N exercícios" e "registra essa resposta" — de onde os dados
// vêm (banco de fábrica ou perguntas criadas depois) é problema deste
// arquivo, não da tela de treino.

import { db, collection, doc, getDocs, setDoc, addDoc, query, where } from "./firebase-config.js";
import { QUESTIONS as EXERCICIOS_PADRAO } from "./data/questions.js";

const COLECAO_EXERCICIOS = "questions";
const COLECAO_RESPOSTAS = "answers";

// Semeia a coleção "questions" do Firestore com o banco inicial, uma
// única vez (mesmo padrão de garantirMateriasSemeadas em subjects-service.js).
export async function garantirExerciciosSemeados() {

    const instantaneo = await getDocs(collection(db, COLECAO_EXERCICIOS));
    if (!instantaneo.empty) return;

    for (const exercicio of EXERCICIOS_PADRAO) {
        await setDoc(doc(db, COLECAO_EXERCICIOS, exercicio.id), exercicio);
    }
}

// Busca um lote de exercícios para uma sessão de treino. Se subjectId
// não for informado, mistura exercícios de todas as matérias (sessão
// geral) — é assim que o dashboard "Start Training" funciona sem
// escolher matéria antes.
export async function buscarLoteExercicios({ subjectId = null, quantidade = 10 } = {}) {

    const referenciaColecao = collection(db, COLECAO_EXERCICIOS);

    const instantaneo = subjectId
        ? await getDocs(query(referenciaColecao, where("subjectId", "==", subjectId)))
        : await getDocs(referenciaColecao);

    const todos = instantaneo.docs.map(d => ({ id: d.id, ...d.data() }));

    return embaralhar(todos).slice(0, quantidade);
}

// Registra a resposta do usuário (coleção "answers") — usado depois
// para progresso, histórico e revisão espaçada (próximas etapas).
export function registrarResposta(uid, { exercicio, respostaIndice, correta, tempoMs }) {
    return addDoc(collection(db, COLECAO_RESPOSTAS), {
        userId: uid,
        questionId: exercicio.id,
        subjectId: exercicio.subjectId,
        topicId: exercicio.topicId,
        difficulty: exercicio.difficulty,
        respostaIndice,
        correta,
        tempoMs,
        createdAt: new Date().toISOString()
    }).catch(erro => console.error("Erro ao registrar resposta:", erro));
}

function embaralhar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

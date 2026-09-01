// ---------------- SISTEMA ADAPTATIVO ----------------
// Depois de cada resposta, atualizamos o progresso do usuário naquele
// TÓPICO, separado por dificuldade (basic/intermediate/advanced) — é
// esse histórico que decide, da próxima vez, se o app puxa questões
// mais fáceis (reforço) ou mais difíceis (o usuário já dominou aquele
// nível). Nenhuma matéria/tópico é tratado de forma especial aqui: a
// função recebe só números.

import { db, collection, doc, getDoc, setDoc, getDocs, query, where } from "./firebase-config.js";

const COLECAO_PROGRESSO = "topicProgress";

function idDocumento(uid, topicId) {
    return `${uid}_${topicId}`;
}

// Registra o resultado de uma resposta no progresso do tópico
// correspondente (cria o documento se ainda não existir).
export async function atualizarProgressoTopico(uid, { subjectId, topicId, difficulty, correta }) {

    const referencia = doc(db, COLECAO_PROGRESSO, idDocumento(uid, topicId));
    const instantaneo = await getDoc(referencia);
    const atual = instantaneo.exists() ? instantaneo.data() : {};

    const campoTotal = `${difficulty}Total`;
    const campoCorreto = `${difficulty}Correct`;

    await setDoc(referencia, {
        userId: uid,
        subjectId,
        topicId,
        ...atual,
        [campoTotal]: (atual[campoTotal] || 0) + 1,
        [campoCorreto]: (atual[campoCorreto] || 0) + (correta ? 1 : 0)
    }, { merge: true });
}

// Progresso de todos os tópicos de uma matéria, para um usuário.
export async function obterProgressoMateria(uid, subjectId) {
    const q = query(
        collection(db, COLECAO_PROGRESSO),
        where("userId", "==", uid),
        where("subjectId", "==", subjectId)
    );
    const instantaneo = await getDocs(q);
    return instantaneo.docs.map(d => d.data());
}

// Progresso de TODAS as matérias de um usuário de uma vez (usado no
// dashboard, para não fazer uma query por matéria).
export async function obterProgressoTodasMaterias(uid) {
    const q = query(collection(db, COLECAO_PROGRESSO), where("userId", "==", uid));
    const instantaneo = await getDocs(q);
    const porMateria = {};

    instantaneo.docs.forEach(d => {
        const dado = d.data();
        if (!porMateria[dado.subjectId]) porMateria[dado.subjectId] = [];
        porMateria[dado.subjectId].push(dado);
    });

    return porMateria;
}

// Dado o progresso de UM tópico, recomenda a próxima dificuldade.
// Regras (seguindo o roadmap): domina o básico → sobe; domina o
// intermediário → sobe; erra muito no nível atual → reforça esse nível.
export function nivelRecomendado(progressoTopico) {

    const { basicTotal = 0, basicCorrect = 0, intermediateTotal = 0, intermediateCorrect = 0,
            advancedTotal = 0, advancedCorrect = 0 } = progressoTopico || {};

    const taxa = (certos, total) => total > 0 ? certos / total : null;

    const taxaBasic = taxa(basicCorrect, basicTotal);
    const taxaIntermediate = taxa(intermediateCorrect, intermediateTotal);
    const taxaAdvanced = taxa(advancedCorrect, advancedTotal);

    if (taxaBasic === null) return "basic";
    if (taxaAdvanced !== null && taxaAdvanced >= 0.7) return "advanced";
    if (taxaBasic >= 0.85 && (taxaIntermediate === null || taxaIntermediate >= 0.7)) return "advanced";
    if (taxaBasic >= 0.7) return "intermediate";

    return "basic";
}

// Status "humano" de uma matéria inteira, a partir do progresso de
// todos os seus tópicos — usado nos cards de Matérias e no Dashboard.
// Retorna uma CHAVE de tradução (não o texto pronto), porque este
// arquivo não sabe em que idioma a tela está — quem chama traduz com
// t() de language.js.
export function statusMateria(progressoTopicos) {

    if (!progressoTopicos || progressoTopicos.length === 0) {
        return { chave: null, percentual: 0, cor: "neutro" };
    }

    let totalCertas = 0;
    let totalRespondidas = 0;

    progressoTopicos.forEach(topico => {
        ["basic", "intermediate", "advanced"].forEach(nivel => {
            totalRespondidas += topico[`${nivel}Total`] || 0;
            totalCertas += topico[`${nivel}Correct`] || 0;
        });
    });

    if (totalRespondidas === 0) {
        return { chave: null, percentual: 0, cor: "neutro" };
    }

    const percentual = Math.round((totalCertas / totalRespondidas) * 100);

    if (percentual >= 85) return { chave: "status.mastered", percentual, cor: "verde" };
    if (percentual >= 60) return { chave: "status.developing", percentual, cor: "amarelo" };
    return { chave: "status.needsReview", percentual, cor: "vermelho" };
}

// ---------------- SERVIÇO DE MATÉRIAS E ASSUNTOS ----------------
// A UI (subjects.js, dashboard.js, etc.) nunca fala com o Firestore
// diretamente nem conhece uma matéria específica por nome — ela só chama
// estas funções. Isso é o que torna a arquitetura expansível de verdade:
// "+ Add Subject" grava um documento novo na coleção "subjects" e, a
// partir daí, ele aparece em qualquer lugar do app que leia
// listarMaterias() — sem tocar em nenhum outro arquivo.

import { db, collection, doc, getDocs, setDoc, addDoc, query, where } from "./firebase-config.js";
import { SUBJECTS as MATERIAS_PADRAO } from "./data/subjects.js";

const COLECAO_MATERIAS = "subjects";
const COLECAO_TOPICOS = "topics";

// Roda uma vez (primeira visita ao app): se a coleção "subjects" do
// Firestore ainda está vazia, semeia com o conteúdo inicial de
// Eletromecânica (js/data/subjects.js). Depois disso, o Firestore passa
// a ser a única fonte da verdade — esse arquivo de dados vira só
// "conteúdo de fábrica".
export async function garantirMateriasSemeadas() {

    const instantaneo = await getDocs(collection(db, COLECAO_MATERIAS));
    if (!instantaneo.empty) return;

    for (const materia of MATERIAS_PADRAO) {

        await setDoc(doc(db, COLECAO_MATERIAS, materia.id), {
            namePt: materia.namePt,
            nameEn: materia.nameEn,
            descriptionPt: "",
            descriptionEn: "",
            icon: materia.icon,
            color: materia.color,
            active: true
        });

        for (const topico of materia.topics) {
            await setDoc(doc(db, COLECAO_TOPICOS, topico.id), {
                subjectId: materia.id,
                namePt: topico.namePt,
                nameEn: topico.nameEn,
                descriptionPt: "",
                difficulty: "basic"
            });
        }
    }
}

export async function listarMaterias() {
    const instantaneo = await getDocs(collection(db, COLECAO_MATERIAS));
    return instantaneo.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(materia => materia.active !== false);
}

export async function buscarMateria(subjectId) {
    const materias = await listarMaterias();
    return materias.find(materia => materia.id === subjectId) || null;
}

export async function listarTopicos(subjectId) {
    const q = query(collection(db, COLECAO_TOPICOS), where("subjectId", "==", subjectId));
    const instantaneo = await getDocs(q);
    return instantaneo.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function adicionarMateria({ namePt, nameEn, descriptionPt, descriptionEn }) {

    const id = gerarSlug(namePt || nameEn);

    await setDoc(doc(db, COLECAO_MATERIAS, id), {
        namePt: namePt || nameEn,
        nameEn: nameEn || namePt,
        descriptionPt: descriptionPt || "",
        descriptionEn: descriptionEn || "",
        icon: "outros",
        color: "#64748B",
        active: true
    });

    return id;
}

export async function adicionarTopico(subjectId, { namePt, nameEn, descriptionPt, difficulty }) {

    const referencia = await addDoc(collection(db, COLECAO_TOPICOS), {
        subjectId,
        namePt: namePt || nameEn,
        nameEn: nameEn || namePt,
        descriptionPt: descriptionPt || "",
        difficulty: difficulty || "basic"
    });

    return referencia.id;
}

function gerarSlug(texto) {
    const base = (texto || "materia")
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    return `${base}-${Date.now().toString(36).slice(-4)}`;
}

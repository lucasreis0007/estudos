// ---------------- MATÉRIAS COMO DADOS ----------------
// Regra de arquitetura do OpenMind: nenhuma matéria vive "hardcoded" no
// código (nada de `if (subject === "motors")`). Todo o app (dashboard,
// treino, exercícios, progresso) lê essa lista e trata cada matéria de
// forma genérica. Para adicionar uma matéria nova no futuro (Pneumática,
// CLP, Automação...), basta acrescentar um objeto novo aqui (ou, mais
// tarde, salvar um documento novo na coleção "subjects" do Firestore) —
// nenhum outro arquivo precisa mudar.
//
// Cada matéria tem: id, nome em pt/en, ícone (id da biblioteca de ícones
// de utils.js), cor de destaque e uma lista de tópicos. Cada tópico tem
// id, nome em pt/en e nível de dificuldade inicial sugerido.

export const SUBJECTS = [
    {
        id: "motores",
        namePt: "Motores e Tipos de Partida",
        nameEn: "Motors and Starting Methods",
        icon: "eletrica",
        color: "#2563EB",
        topics: [
            { id: "motores-inducao", namePt: "Motor de indução trifásico", nameEn: "Three-phase induction motor" },
            { id: "motores-partida-direta", namePt: "Partida direta", nameEn: "Direct-on-line starting" },
            { id: "motores-estrela-triangulo", namePt: "Partida estrela-triângulo", nameEn: "Star-delta starting" },
            { id: "motores-soft-starter", namePt: "Soft-starter e inversor de frequência", nameEn: "Soft starter and VFD" }
        ]
    },
    {
        id: "dimensionamento",
        namePt: "Dimensionamento",
        nameEn: "Sizing and Rating",
        icon: "reserva",
        color: "#0D9488",
        topics: [
            { id: "dim-cabos", namePt: "Dimensionamento de cabos", nameEn: "Cable sizing" },
            { id: "dim-disjuntores", namePt: "Dimensionamento de disjuntores", nameEn: "Circuit breaker sizing" },
            { id: "dim-motores", namePt: "Dimensionamento de motores", nameEn: "Motor sizing" }
        ]
    },
    {
        id: "manutencao",
        namePt: "Manutenção Preventiva e Corretiva",
        nameEn: "Preventive and Corrective Maintenance",
        icon: "manutencao",
        color: "#B45309",
        topics: [
            { id: "manut-preventiva", namePt: "Planos de manutenção preventiva", nameEn: "Preventive maintenance plans" },
            { id: "manut-corretiva", namePt: "Diagnóstico e manutenção corretiva", nameEn: "Troubleshooting and corrective maintenance" },
            { id: "manut-vibracao", namePt: "Análise de vibração", nameEn: "Vibration analysis" }
        ]
    },
    {
        id: "processos-fabricacao",
        namePt: "Processos de Fabricação",
        nameEn: "Manufacturing Processes",
        icon: "trabalho",
        color: "#7C3AED",
        topics: [
            { id: "fab-fundicao", namePt: "Fundição", nameEn: "Casting" },
            { id: "fab-soldagem", namePt: "Soldagem", nameEn: "Welding" },
            { id: "fab-conformacao", namePt: "Conformação mecânica", nameEn: "Metal forming" }
        ]
    },
    {
        id: "usinagem",
        namePt: "Usinagem",
        nameEn: "Machining",
        icon: "manutencao",
        color: "#DC2626",
        topics: [
            { id: "usin-parametros", namePt: "Parâmetros de corte", nameEn: "Cutting parameters" },
            { id: "usin-ferramentas", namePt: "Ferramentas de corte", nameEn: "Cutting tools" }
        ]
    },
    {
        id: "desenho-tecnico",
        namePt: "Desenho Técnico",
        nameEn: "Technical Drawing",
        icon: "educacao",
        color: "#CA8A04",
        topics: [
            { id: "desenho-projecoes", namePt: "Projeções ortográficas", nameEn: "Orthographic projections" },
            { id: "desenho-cotas", namePt: "Cotagem e tolerâncias", nameEn: "Dimensioning and tolerances" }
        ]
    },
    {
        id: "eletrica-predial",
        namePt: "Elétrica Predial",
        nameEn: "Building Electrical Systems",
        icon: "casa",
        color: "#0284C7",
        topics: [
            { id: "predial-quadros", namePt: "Quadros de distribuição", nameEn: "Distribution panels" },
            { id: "predial-protecao", namePt: "Dispositivos de proteção", nameEn: "Protection devices" }
        ]
    },
    {
        id: "torno",
        namePt: "Operação de Torno",
        nameEn: "Lathe Operation",
        icon: "manutencao",
        color: "#475569",
        topics: [
            { id: "torno-basico", namePt: "Operações básicas de torno", nameEn: "Basic lathe operations" }
        ]
    },
    {
        id: "fresadora",
        namePt: "Operação de Fresadora",
        nameEn: "Milling Machine Operation",
        icon: "manutencao",
        color: "#4338CA",
        topics: [
            { id: "fresa-basico", namePt: "Operações básicas de fresadora", nameEn: "Basic milling operations" }
        ]
    }
];

// Busca genérica — usada por todo o app em vez de referenciar matérias
// específicas diretamente.
export function buscarMateria(id) {
    return SUBJECTS.find(materia => materia.id === id);
}

export function buscarTopico(subjectId, topicId) {
    const materia = buscarMateria(subjectId);
    return materia?.topics.find(topico => topico.id === topicId);
}

export function todosOsTopicos() {
    return SUBJECTS.flatMap(materia =>
        materia.topics.map(topico => ({ ...topico, subjectId: materia.id }))
    );
}

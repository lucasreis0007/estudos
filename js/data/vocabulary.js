// ---------------- VOCABULÁRIO TÉCNICO ----------------
// Banco inicial de vocabulário técnico (inglês ⇄ português) usado no
// modo "Mixed / English Training" e na área "Technical English".
// Assim como as matérias, isso é dado — o progresso de cada palavra por
// usuário (acertos, domínio, próxima revisão) fica no Firestore, na
// coleção "vocabularyProgress"; esse arquivo é só o banco de palavras.

export const VOCABULARY = [
    { id: "motor", english: "Motor", portuguese: "Motor", category: "motores", examplePt: "O motor está superaquecendo.", exampleEn: "The motor is overheating.", difficulty: "basic" },
    { id: "bearing", english: "Bearing", portuguese: "Rolamento", category: "manutencao", examplePt: "O rolamento precisa ser trocado.", exampleEn: "The bearing needs to be replaced.", difficulty: "basic" },
    { id: "shaft", english: "Shaft", portuguese: "Eixo", category: "motores", examplePt: "O eixo está desalinhado.", exampleEn: "The shaft is misaligned.", difficulty: "basic" },
    { id: "gear", english: "Gear", portuguese: "Engrenagem", category: "manutencao", examplePt: "A engrenagem está desgastada.", exampleEn: "The gear is worn out.", difficulty: "basic" },
    { id: "circuit-breaker", english: "Circuit breaker", portuguese: "Disjuntor", category: "eletrica-predial", examplePt: "O disjuntor desarmou.", exampleEn: "The circuit breaker tripped.", difficulty: "intermediate" },
    { id: "voltage", english: "Voltage", portuguese: "Tensão", category: "dimensionamento", examplePt: "A tensão está instável.", exampleEn: "The voltage is unstable.", difficulty: "basic" },
    { id: "current", english: "Current", portuguese: "Corrente", category: "dimensionamento", examplePt: "A corrente está acima do normal.", exampleEn: "The current is above normal.", difficulty: "basic" },
    { id: "resistance", english: "Resistance", portuguese: "Resistência", category: "dimensionamento", examplePt: "Meça a resistência do enrolamento.", exampleEn: "Measure the winding resistance.", difficulty: "intermediate" },
    { id: "power", english: "Power", portuguese: "Potência", category: "dimensionamento", examplePt: "Qual é a potência do motor?", exampleEn: "What is the motor's power rating?", difficulty: "basic" },
    { id: "maintenance", english: "Maintenance", portuguese: "Manutenção", category: "manutencao", examplePt: "A manutenção está agendada.", exampleEn: "Maintenance is scheduled.", difficulty: "basic" },
    { id: "failure", english: "Failure", portuguese: "Falha", category: "manutencao", examplePt: "Identifique a causa da falha.", exampleEn: "Identify the cause of the failure.", difficulty: "basic" },
    { id: "tool", english: "Tool", portuguese: "Ferramenta", category: "usinagem", examplePt: "Troque a ferramenta de corte.", exampleEn: "Replace the cutting tool.", difficulty: "basic" },
    { id: "lathe", english: "Lathe", portuguese: "Torno", category: "torno", examplePt: "Ligue o torno.", exampleEn: "Turn on the lathe.", difficulty: "basic" },
    { id: "milling-machine", english: "Milling machine", portuguese: "Fresadora", category: "fresadora", examplePt: "A fresadora está calibrada.", exampleEn: "The milling machine is calibrated.", difficulty: "intermediate" },
    { id: "cutting-speed", english: "Cutting speed", portuguese: "Velocidade de corte", category: "usinagem", examplePt: "Ajuste a velocidade de corte.", exampleEn: "Adjust the cutting speed.", difficulty: "intermediate" },
    { id: "feed-rate", english: "Feed rate", portuguese: "Avanço", category: "usinagem", examplePt: "O avanço está muito alto.", exampleEn: "The feed rate is too high.", difficulty: "intermediate" },
    { id: "technical-drawing", english: "Technical drawing", portuguese: "Desenho técnico", category: "desenho-tecnico", examplePt: "Leia o desenho técnico.", exampleEn: "Read the technical drawing.", difficulty: "basic" },
    { id: "measurement", english: "Measurement", portuguese: "Medição", category: "desenho-tecnico", examplePt: "Confira a medição.", exampleEn: "Check the measurement.", difficulty: "basic" },
    { id: "dimension", english: "Dimension", portuguese: "Dimensão", category: "desenho-tecnico", examplePt: "Verifique a dimensão da peça.", exampleEn: "Check the part's dimension.", difficulty: "basic" }
];

export function buscarPalavra(id) {
    return VOCABULARY.find(palavra => palavra.id === id);
}

export function palavrasPorCategoria(categoria) {
    return VOCABULARY.filter(palavra => palavra.category === categoria);
}

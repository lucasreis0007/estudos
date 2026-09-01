// ---------------- BANCO INICIAL DE EXERCÍCIOS ----------------
// Assim como matérias e tópicos, exercícios são dado — nenhuma lógica
// de treino conhece uma pergunta específica. Cada exercício já nasce
// bilíngue (questionPt/questionEn, optionsPt/optionsEn,
// explicacaoPt/explicacaoEn) porque a etapa 7 (idiomas) vai precisar
// disso; por enquanto a UI (etapa 5) só usa os campos em português.
//
// Tipo suportado nesta etapa: "multipla-escolha" (índice da opção
// correta em `correta`). Outros tipos do roadmap (verdadeiro/falso,
// numérica, prática) entram depois sem quebrar esta estrutura.

export const QUESTIONS = [

    // ---------------- MOTORES ----------------
    {
        id: "q-motores-001",
        subjectId: "motores",
        topicId: "motores-inducao",
        difficulty: "basic",
        type: "multipla-escolha",
        questionPt: "Qual é o princípio de funcionamento de um motor de indução trifásico?",
        questionEn: "What is the operating principle of a three-phase induction motor?",
        optionsPt: [
            "Campo magnético girante induz corrente no rotor",
            "Comutador inverte a polaridade do rotor",
            "Ímãs permanentes fixos no estator",
            "Corrente contínua alimenta diretamente o rotor"
        ],
        optionsEn: [
            "A rotating magnetic field induces current in the rotor",
            "A commutator reverses the rotor's polarity",
            "Fixed permanent magnets in the stator",
            "Direct current feeds the rotor directly"
        ],
        correta: 0,
        explicacaoPt: "O estator cria um campo magnético girante que induz corrente no rotor (por indução eletromagnética), gerando o torque — por isso não há contato elétrico direto com o rotor em motores de gaiola.",
        explicacaoEn: "The stator creates a rotating magnetic field that induces current in the rotor via electromagnetic induction, producing torque — that's why squirrel-cage rotors have no direct electrical contact."
    },
    {
        id: "q-motores-002",
        subjectId: "motores",
        topicId: "motores-partida-direta",
        difficulty: "basic",
        type: "multipla-escolha",
        questionPt: "A partida direta de um motor trifásico é indicada principalmente para:",
        questionEn: "Direct-on-line starting of a three-phase motor is mainly suited for:",
        optionsPt: [
            "Motores de pequena/média potência com rede que suporta a corrente de partida",
            "Motores de grande potência em redes fracas",
            "Cargas que exigem partida suave obrigatória",
            "Motores monofásicos apenas"
        ],
        optionsEn: [
            "Small/medium power motors on a grid that supports the inrush current",
            "High power motors on weak grids",
            "Loads that require mandatory soft starting",
            "Single-phase motors only"
        ],
        correta: 0,
        explicacaoPt: "Na partida direta a corrente de partida pode chegar a 6-8x a nominal. Por isso só é indicada quando a rede/instalação suporta esse pico, geralmente em motores de menor potência.",
        explicacaoEn: "In DOL starting, inrush current can reach 6-8x the rated current, so it's only suitable when the grid/installation can handle that peak — typically smaller motors."
    },
    {
        id: "q-motores-003",
        subjectId: "motores",
        topicId: "motores-estrela-triangulo",
        difficulty: "intermediate",
        type: "multipla-escolha",
        questionPt: "Na partida estrela-triângulo, a tensão aplicada a cada enrolamento na ligação estrela é reduzida por um fator de aproximadamente:",
        questionEn: "In star-delta starting, the voltage applied to each winding in the star connection is reduced by a factor of approximately:",
        optionsPt: ["√3 (1,73)", "2", "3", "0,5"],
        optionsEn: ["√3 (1.73)", "2", "3", "0.5"],
        correta: 0,
        explicacaoPt: "Na ligação estrela, a tensão em cada enrolamento é a tensão de linha dividida por √3, reduzindo a corrente de partida para cerca de 1/3 da corrente da partida direta.",
        explicacaoEn: "In the star connection, the voltage across each winding is the line voltage divided by √3, reducing inrush current to roughly 1/3 of the direct-on-line value."
    },
    {
        id: "q-motores-004",
        subjectId: "motores",
        topicId: "motores-soft-starter",
        difficulty: "advanced",
        type: "multipla-escolha",
        questionPt: "Uma vantagem do inversor de frequência (VFD) sobre o soft-starter é:",
        questionEn: "An advantage of a variable frequency drive (VFD) over a soft starter is:",
        optionsPt: [
            "Permite controlar a velocidade do motor continuamente, não só a partida",
            "É sempre mais barato",
            "Não precisa de dimensionamento térmico",
            "Elimina a necessidade de disjuntor"
        ],
        optionsEn: [
            "It allows continuous speed control, not just soft starting",
            "It is always cheaper",
            "No thermal sizing is needed",
            "It removes the need for a circuit breaker"
        ],
        correta: 0,
        explicacaoPt: "O soft-starter só atua na partida/parada (controle de tensão). O VFD controla frequência e tensão continuamente, permitindo variar a velocidade do motor durante toda a operação.",
        explicacaoEn: "A soft starter only acts during start/stop (voltage control). A VFD continuously controls frequency and voltage, allowing speed to be varied throughout operation."
    },

    // ---------------- DIMENSIONAMENTO ----------------
    {
        id: "q-dim-001",
        subjectId: "dimensionamento",
        topicId: "dim-cabos",
        difficulty: "basic",
        type: "multipla-escolha",
        questionPt: "O principal critério para dimensionar a bitola de um cabo elétrico é:",
        questionEn: "The main criterion for sizing a cable's cross-section is:",
        optionsPt: [
            "Capacidade de condução de corrente e queda de tensão admissível",
            "Cor da capa do cabo",
            "Comprimento do cabo apenas",
            "Marca do fabricante"
        ],
        optionsEn: [
            "Current-carrying capacity and allowable voltage drop",
            "The cable jacket color",
            "Cable length alone",
            "The manufacturer's brand"
        ],
        correta: 0,
        explicacaoPt: "O dimensionamento considera a corrente de projeto (capacidade térmica do condutor) e a queda de tensão admissível ao longo do percurso — ambos precisam ser verificados.",
        explicacaoEn: "Sizing considers the design current (thermal capacity of the conductor) and the allowable voltage drop along the run — both need to be checked."
    },
    {
        id: "q-dim-002",
        subjectId: "dimensionamento",
        topicId: "dim-disjuntores",
        difficulty: "intermediate",
        type: "multipla-escolha",
        questionPt: "A corrente nominal do disjuntor de proteção de um circuito deve ser, em relação à capacidade do cabo:",
        questionEn: "The rated current of a circuit's protective breaker, relative to the cable's capacity, should be:",
        optionsPt: [
            "Igual ou inferior à capacidade de condução do cabo",
            "Sempre o dobro da capacidade do cabo",
            "Independente da capacidade do cabo",
            "Sempre a menor disponível no mercado"
        ],
        optionsEn: [
            "Equal to or lower than the cable's current-carrying capacity",
            "Always double the cable's capacity",
            "Independent of the cable's capacity",
            "Always the smallest one available"
        ],
        correta: 0,
        explicacaoPt: "O disjuntor deve proteger o cabo: sua corrente nominal não pode ultrapassar a capacidade de condução do condutor, senão o cabo pode superaquecer antes do disjuntor atuar.",
        explicacaoEn: "The breaker must protect the cable: its rated current cannot exceed the conductor's carrying capacity, or the cable could overheat before the breaker trips."
    },
    {
        id: "q-dim-003",
        subjectId: "dimensionamento",
        topicId: "dim-motores",
        difficulty: "intermediate",
        type: "multipla-escolha",
        questionPt: "Para dimensionar a proteção de um motor elétrico, além da corrente nominal deve-se considerar:",
        questionEn: "To size a motor's protection, besides rated current one must also consider:",
        optionsPt: [
            "A corrente de partida e o tempo de partida",
            "Somente a cor da carcaça",
            "Apenas o peso do motor",
            "Somente a tensão de linha"
        ],
        optionsEn: [
            "The inrush current and starting time",
            "Only the frame color",
            "Only the motor's weight",
            "Only the line voltage"
        ],
        correta: 0,
        explicacaoPt: "A proteção precisa suportar o pico de corrente de partida (várias vezes a nominal) durante o tempo de partida, sem atuar indevidamente, mas ainda proteger contra sobrecarga real.",
        explicacaoEn: "The protection must withstand the inrush current peak (several times the rated value) during the starting time without nuisance tripping, while still protecting against real overload."
    },

    // ---------------- MANUTENÇÃO ----------------
    {
        id: "q-manut-001",
        subjectId: "manutencao",
        topicId: "manut-preventiva",
        difficulty: "basic",
        type: "multipla-escolha",
        questionPt: "Manutenção preventiva é caracterizada por:",
        questionEn: "Preventive maintenance is characterized by:",
        optionsPt: [
            "Intervenções programadas para evitar falhas antes que ocorram",
            "Consertar o equipamento só depois que ele quebra",
            "Nunca inspecionar o equipamento",
            "Trocar peças aleatoriamente sem plano"
        ],
        optionsEn: [
            "Scheduled interventions to prevent failures before they happen",
            "Fixing the equipment only after it breaks",
            "Never inspecting the equipment",
            "Replacing parts randomly with no plan"
        ],
        correta: 0,
        explicacaoPt: "A manutenção preventiva segue um plano (por tempo de uso, ciclos ou calendário) para reduzir a probabilidade de falha, ao contrário da corretiva, que age depois que a falha já ocorreu.",
        explicacaoEn: "Preventive maintenance follows a plan (by usage time, cycles, or calendar) to reduce failure probability, unlike corrective maintenance, which acts after the failure has already occurred."
    },
    {
        id: "q-manut-002",
        subjectId: "manutencao",
        topicId: "manut-corretiva",
        difficulty: "intermediate",
        type: "multipla-escolha",
        questionPt: "Um motor trifásico está aquecendo acima do normal e vibrando. O primeiro passo no diagnóstico deve ser:",
        questionEn: "A three-phase motor is overheating and vibrating. The first diagnostic step should be:",
        optionsPt: [
            "Verificar alinhamento, balanceamento e fixação mecânica",
            "Trocar o motor imediatamente sem investigar",
            "Aumentar a tensão de alimentação",
            "Ignorar, pois vibração é sempre normal"
        ],
        optionsEn: [
            "Check alignment, balance, and mechanical mounting",
            "Replace the motor immediately without investigating",
            "Increase the supply voltage",
            "Ignore it, since vibration is always normal"
        ],
        correta: 0,
        explicacaoPt: "Aquecimento com vibração costuma indicar causa mecânica (desalinhamento, desbalanceamento, rolamento) ou elétrica (desequilíbrio de fases). Verificar o lado mecânico primeiro é rápido e não-destrutivo.",
        explicacaoEn: "Overheating with vibration usually points to a mechanical cause (misalignment, imbalance, bearing) or an electrical one (phase imbalance). Checking the mechanical side first is quick and non-destructive."
    },
    {
        id: "q-manut-003",
        subjectId: "manutencao",
        topicId: "manut-vibracao",
        difficulty: "advanced",
        type: "multipla-escolha",
        questionPt: "Na análise de vibração, uma frequência dominante igual a 1x a rotação do eixo geralmente indica:",
        questionEn: "In vibration analysis, a dominant frequency equal to 1x shaft rotation usually indicates:",
        optionsPt: [
            "Desbalanceamento",
            "Falha de engrenagem",
            "Cavitação de bomba",
            "Curto-circuito no estator"
        ],
        optionsEn: [
            "Unbalance",
            "Gear failure",
            "Pump cavitation",
            "Stator short circuit"
        ],
        correta: 0,
        explicacaoPt: "Desbalanceamento tipicamente aparece como um pico dominante em 1x a frequência de rotação (1x RPM) no espectro de vibração.",
        explicacaoEn: "Unbalance typically shows up as a dominant peak at 1x the rotational speed (1x RPM) in the vibration spectrum."
    },

    // ---------------- USINAGEM ----------------
    {
        id: "q-usin-001",
        subjectId: "usinagem",
        topicId: "usin-parametros",
        difficulty: "basic",
        type: "multipla-escolha",
        questionPt: "Velocidade de corte (Vc) em usinagem se refere a:",
        questionEn: "Cutting speed (Vc) in machining refers to:",
        optionsPt: [
            "Velocidade relativa entre a ferramenta e a peça na superfície de corte",
            "Velocidade de deslocamento da mesa da máquina",
            "Rotação do motor da máquina em RPM apenas",
            "Velocidade de troca de ferramenta"
        ],
        optionsEn: [
            "The relative speed between tool and workpiece at the cutting surface",
            "The machine table's travel speed",
            "The machine motor's RPM alone",
            "The tool-change speed"
        ],
        correta: 0,
        explicacaoPt: "A velocidade de corte é a velocidade periférica relativa entre a aresta de corte da ferramenta e a superfície da peça, geralmente em m/min — depende do material e da ferramenta.",
        explicacaoEn: "Cutting speed is the relative peripheral speed between the tool's cutting edge and the workpiece surface, usually in m/min — it depends on the material and the tool."
    },
    {
        id: "q-usin-002",
        subjectId: "usinagem",
        topicId: "usin-parametros",
        difficulty: "intermediate",
        type: "multipla-escolha",
        questionPt: "Se o avanço (feed rate) for aumentado além do recomendado, o resultado mais provável é:",
        questionEn: "If the feed rate is increased beyond what is recommended, the most likely result is:",
        optionsPt: [
            "Pior acabamento superficial e maior desgaste da ferramenta",
            "Melhor acabamento superficial sempre",
            "Nenhum efeito perceptível",
            "Redução do tempo de vida útil da peça bruta apenas"
        ],
        optionsEn: [
            "Worse surface finish and faster tool wear",
            "Always better surface finish",
            "No noticeable effect",
            "Only reduces the raw stock's shelf life"
        ],
        correta: 0,
        explicacaoPt: "Um avanço excessivo aumenta a força de corte e as marcas deixadas na peça, piorando o acabamento e acelerando o desgaste (ou até quebra) da ferramenta.",
        explicacaoEn: "Excessive feed increases cutting force and the marks left on the part, worsening the finish and speeding up tool wear (or even breakage)."
    },
    {
        id: "q-usin-003",
        subjectId: "usinagem",
        topicId: "usin-ferramentas",
        difficulty: "basic",
        type: "multipla-escolha",
        questionPt: "Ferramentas de metal duro (carbureto), comparadas ao aço rápido (HSS), geralmente permitem:",
        questionEn: "Carbide tools, compared to high-speed steel (HSS), generally allow:",
        optionsPt: [
            "Velocidades de corte mais altas e maior resistência ao desgaste térmico",
            "Velocidades de corte mais baixas sempre",
            "Uso exclusivo em madeira",
            "Nenhuma vantagem sobre o HSS"
        ],
        optionsEn: [
            "Higher cutting speeds and better resistance to thermal wear",
            "Always lower cutting speeds",
            "Exclusive use on wood",
            "No advantage over HSS"
        ],
        correta: 0,
        explicacaoPt: "O metal duro mantém a dureza em temperaturas mais altas que o HSS, permitindo trabalhar com velocidades de corte maiores sem perder o fio da ferramenta rapidamente.",
        explicacaoEn: "Carbide retains hardness at higher temperatures than HSS, allowing higher cutting speeds without quickly losing the tool's edge."
    },

    // ---------------- DESENHO TÉCNICO ----------------
    {
        id: "q-desenho-001",
        subjectId: "desenho-tecnico",
        topicId: "desenho-projecoes",
        difficulty: "basic",
        type: "multipla-escolha",
        questionPt: "No método do primeiro diedro (usado no Brasil/Europa), a vista lateral esquerda é desenhada:",
        questionEn: "In first-angle projection (used in Brazil/Europe), the left side view is drawn:",
        optionsPt: [
            "À direita da vista frontal",
            "À esquerda da vista frontal",
            "Acima da vista frontal",
            "Não é utilizada nesse método"
        ],
        optionsEn: [
            "To the right of the front view",
            "To the left of the front view",
            "Above the front view",
            "It is not used in this method"
        ],
        correta: 0,
        explicacaoPt: "No primeiro diedro, a peça fica entre o observador e o plano de projeção, então a vista lateral esquerda \"cai\" do lado direito do desenho — o oposto do terceiro diedro (usado nos EUA).",
        explicacaoEn: "In first-angle projection, the object sits between the observer and the projection plane, so the left side view ends up on the right side of the drawing — the opposite of third-angle projection (used in the US)."
    },
    {
        id: "q-desenho-002",
        subjectId: "desenho-tecnico",
        topicId: "desenho-cotas",
        difficulty: "intermediate",
        type: "multipla-escolha",
        questionPt: "Uma tolerância dimensional de Ø20 ±0,05 mm significa que a peça é aceita se o diâmetro medido estiver:",
        questionEn: "A dimensional tolerance of Ø20 ±0.05 mm means the part is accepted if the measured diameter is:",
        optionsPt: [
            "Entre 19,95 mm e 20,05 mm",
            "Exatamente 20,00 mm sempre",
            "Entre 20,00 mm e 20,50 mm",
            "Qualquer valor próximo de 20 mm"
        ],
        optionsEn: [
            "Between 19.95 mm and 20.05 mm",
            "Always exactly 20.00 mm",
            "Between 20.00 mm and 20.50 mm",
            "Any value near 20 mm"
        ],
        correta: 0,
        explicacaoPt: "A tolerância ±0,05 mm define uma faixa aceitável em torno da cota nominal: de 20 - 0,05 = 19,95 mm até 20 + 0,05 = 20,05 mm.",
        explicacaoEn: "The ±0.05 mm tolerance defines an acceptable range around the nominal dimension: from 20 - 0.05 = 19.95 mm to 20 + 0.05 = 20.05 mm."
    }
];

export function questoesPorMateria(subjectId) {
    return QUESTIONS.filter(questao => questao.subjectId === subjectId);
}

export function questoesPorTopico(topicId) {
    return QUESTIONS.filter(questao => questao.topicId === topicId);
}

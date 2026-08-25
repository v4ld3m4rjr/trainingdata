/* ===================================================================
   config.js — Constants, Variable Registry & Scale Legends
   =================================================================== */

const VARS = {
    TSS:         { label: 'TSS',          color: '#7c3aed', cat: 'carga' },
    TRIMP:       { label: 'TRIMP',        color: '#9333ea', cat: 'carga' },
    ATL:         { label: 'ATL (Aguda)',   color: '#06b6d4', cat: 'carga' },
    CTL:         { label: 'CTL (Crônica)', color: '#10b981', cat: 'carga' },
    TSB:         { label: 'TSB (Balanço)', color: '#f59e0b', cat: 'carga' },
    Monotonia:   { label: 'Monotonia',     color: '#ef4444', cat: 'carga' },
    PSE:         { label: 'PSE',           color: '#e879f9', cat: 'treino' },
    HRV:         { label: 'HRV (ms)',      color: '#00e5ff', cat: 'autonomico' },
    FCmedia:     { label: 'FC Média',      color: '#f43f5e', cat: 'treino' },
    Prontidao:   { label: 'Prontidão',     color: '#22d3ee', cat: 'subj' },
    Recuperacao: { label: 'Recuperação',   color: '#34d399', cat: 'subj' },
    Hooper:      { label: 'Hooper Idx',    color: '#fb923c', cat: 'subj' },
    TQR:         { label: 'TQR',           color: '#a78bfa', cat: 'subj' },
    PRS:         { label: 'PRS',           color: '#2dd4bf', cat: 'subj' },
    Dor:         { label: 'Dor',           color: '#f87171', cat: 'subj' },
    SonoQ:       { label: 'Sono Qual.',    color: '#60a5fa', cat: 'subj' },
    Motivacao:   { label: 'Motivação',     color: '#fbbf24', cat: 'subj' },
};

const DEFAULT_ACTIVE_VARS = ['TSS', 'ATL', 'CTL', 'TSB', 'HRV', 'Prontidao'];

const SK = {
    USER:     'syn_user',
    USERS:    'syn_users',
    DATA:     'syn_data',
};

const SCALE_LEGENDS = {
    sonoQ: {
        title: 'Qualidade do Sono (0 a 10)',
        min: 0, max: 10,
        descriptions: {
            0: 'Insônia total / Noite em claro',
            1: 'Péssimo — Sono extremamente entrecortado',
            2: 'Muito ruim — Múltiplos despertares e agitação',
            3: 'Ruim — Sono superficial e insuficiente',
            4: 'Abaixo da média — Descanso incompleto',
            5: 'Regular — Sono neutro, descanso moderado',
            6: 'Razoável — Sono contínuo com leve cansaço',
            7: 'Bom — Repousante e revigorante',
            8: 'Muito bom — Sono profundo e restaurador',
            9: 'Excelente — Sono revigorante e contínuo',
            10: 'Perfeito — Restauração física e mental máxima'
        }
    },
    fadiga: {
        title: 'Fadiga Geral (0 a 10)',
        min: 0, max: 10,
        descriptions: {
            0: 'Nenhuma fadiga — Energia e vigor máximos',
            1: 'Mínima — Quase imperceptível',
            2: 'Muito leve — Disposição excelente',
            3: 'Leve — Sensação sutil de cansaço',
            4: 'Leve a moderada — Cansaço muscular discreto',
            5: 'Moderada — Cansaço perceptível no dia a dia',
            6: 'Moderada a alta — Redução perceptível de energia',
            7: 'Alta — Cansaço físico e mental claro',
            8: 'Muito alta — Dificuldade para realizar treinos',
            9: 'Severa — Exaustão profunda',
            10: 'Extrema — Esgotamento físico total'
        }
    },
    estresse: {
        title: 'Nível de Estresse (0 a 10)',
        min: 0, max: 10,
        descriptions: {
            0: 'Nenhum estresse — Calma e serenidade absolutas',
            1: 'Mínimo — Estado bem relaxado',
            2: 'Muito baixo — Pouca ou nenhuma preocupação',
            3: 'Baixo — Estresse cotidiano leve e controlado',
            4: 'Leve a moderado — Tensão transitória',
            5: 'Moderado — Tensão equilibrada',
            6: 'Moderado a alto — Preocupações constantes',
            7: 'Alto — Sobrecarga mental ou emocional',
            8: 'Muito alto — Dificuldade em relaxar e focar',
            9: 'Severo — Sobrecarga crônica ou ansiedade',
            10: 'Extremo — Esgotamento por estresse'
        }
    },
    doms: {
        title: 'Dor Muscular Tardia / DOMS (0 a 10)',
        min: 0, max: 10,
        descriptions: {
            0: 'Nenhuma dor — Músculos 100% soltos e recuperados',
            1: 'Mínima — Tônus aumentado sem desconforto',
            2: 'Muito leve — Sensibilidade sutil ao toque',
            3: 'Leve — Dor leve apenas em contrações fortes',
            4: 'Leve a moderada — Rigidez muscular inicial',
            5: 'Moderada — Dor clara ao movimentar e alongar',
            6: 'Moderada a alta — Rigidez com incômodo nos treinos',
            7: 'Alta — Dor forte, movimentos restritos',
            8: 'Muito alta — Dificuldade em tarefas simples',
            9: 'Severa — Dor intensa com perda de amplitude',
            10: 'Insuportável — Dor extrema e incapacitante'
        }
    },
    humor: {
        title: 'Estado de Humor (0 a 10)',
        min: 0, max: 10,
        descriptions: {
            0: 'Péssimo — Extremamente irritado ou deprimido',
            1: 'Muito ruim — Muito desanimado e sem energia',
            2: 'Ruim — Desmotivado e impaciente',
            3: 'Baixo — Desânimo passageiro',
            4: 'Levemente baixo — Pouca empolgação',
            5: 'Neutro — Humor estável e equilibrado',
            6: 'Moderado-positivo — Disposição razoável',
            7: 'Bom — Positivo, focado e animado',
            8: 'Muito bom — Alto astral e bem-estar',
            9: 'Excelente — Otimista e entusiasmado',
            10: 'Perfeito — Estado de plenitude e motivação máxima'
        }
    },
    tqr: {
        title: 'TQR — Total Quality Recovery (0 a 13)',
        min: 0, max: 13,
        descriptions: {
            0: 'Nenhuma recuperação — Estado crítico',
            1: 'Recuperação extremamente pobre',
            2: 'Recuperação muito ruim',
            3: 'Recuperação ruim',
            4: 'Recuperação fraca',
            5: 'Recuperação insuficiente',
            6: 'Recuperação razoável',
            7: 'Recuperação moderada',
            8: 'Boa recuperação',
            9: 'Muito boa recuperação',
            10: 'Recuperação excelente',
            11: 'Recuperação ótima / Vigorosa',
            12: 'Recuperação quase completa',
            13: 'Recuperação total — Capacidade regenerativa máxima'
        }
    },
    prs: {
        title: 'PRS — Recuperação Percebida (0 a 10)',
        min: 0, max: 10,
        descriptions: {
            0: 'Pior recuperação possível / Sem energia',
            1: 'Muito baixa — Corpo pesado e fadigado',
            2: 'Baixa — Dificuldade em sustentar esforços',
            3: 'Abaixo da média — Recuperação deficiente',
            4: 'Quase aceitável — Treino leve possível',
            5: 'Moderada — Capacidade de treino submáximo',
            6: 'Razoável — Prontidão para carga moderada',
            7: 'Boa — Corpo disposto e pronto',
            8: 'Muito boa — Alto nível de prontidão',
            9: 'Excelente — Estado de supercompensação',
            10: 'Excepcional — Capacidade atlética máxima'
        }
    },
    dor: {
        title: 'Dor Geral / Articular (0 a 10)',
        min: 0, max: 10,
        descriptions: {
            0: 'Sem dor — Total conforto físico',
            1: 'Mínima — Desconforto quase imperceptível',
            2: 'Muito leve — Incômodo pontual discreto',
            3: 'Leve — Dor leve sem limitação funcional',
            4: 'Leve a moderada — Desconforto presente',
            5: 'Moderada — Dor perceptível nos movimentos',
            6: 'Moderada a intensa — Exige atenção nos treinos',
            7: 'Intensa — Interfere na performance',
            8: 'Muito intensa — Dificuldade para treinar',
            9: 'Severa — Dor muito forte com restrição',
            10: 'Insuportável — Dor aguda extrema'
        }
    },
    motivacao: {
        title: 'Motivação para Treinar (0 a 10)',
        min: 0, max: 10,
        descriptions: {
            0: 'Nenhuma vontade — Aversão total ao treino',
            1: 'Extremamente baixa — Desejo de não treinar',
            2: 'Muito baixa — Treina apenas por obrigação',
            3: 'Baixa — Pouca disposição mental',
            4: 'Abaixo da média — Desânimo leve',
            5: 'Neutra — Disposição regular',
            6: 'Razoável — Vontade moderada',
            7: 'Boa — Disposto e motivado',
            8: 'Muito boa — Grande empolgação e foco',
            9: 'Alta — Muito focado e determinado',
            10: 'Máxima — Entusiasmo e foco absolutos'
        }
    },
    wkPse: {
        title: 'PSE — Percepção Subjetiva de Esforço (Borg CR-10: 0 a 10)',
        min: 0, max: 10,
        descriptions: {
            0: 'Repouso absoluto — Sem esforço',
            1: 'Muito, muito leve — Caminhada muito lenta',
            2: 'Muito leve — Ritmo fácil e confortável',
            3: 'Leve — Ritmo conversacional sustentável',
            4: 'Moderado — Começo de suor e respiração mais profunda',
            5: 'Algo pesado — Respiração acelerada, exige concentração',
            6: 'Pesado — Ritmo forte, esforço claro',
            7: 'Muito pesado — Difícil falar frases completas',
            8: 'Muito, muito pesado — Esforço intenso, próximo do limite',
            9: 'Extremamente pesado — Limiar quase máximo',
            10: 'Máximo — Esforço até a exaustão'
        }
    }
};

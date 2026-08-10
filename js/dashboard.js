/* ===================================================================
   dashboard.js — Index Cards & Deep Neurophysiological AI Analysis
   3-Block Neurophysiological Synthesis:
   1. Adaptações do Treinamento
   2. Adaptações nos Processos de Fadiga
   3. Adaptações para o Próximo Ciclo
   =================================================================== */

function updateIndices(data) {
    if (!data || !data.length) return;
    const L = data[data.length - 1];
    const rec = CL(L.recuperacao || 0, 0, 100);
    const pront = CL(L.prontidao || 0, 0, 100);
    const intens = CL(Math.round(pront * 0.85 + 10), 0, 100);

    setIdx('idxRecovery', rec, rec >= 70 ? 'var(--success)' : rec >= 40 ? 'var(--warning)' : 'var(--danger)');
    setIdx('idxReadiness', pront, pront >= 70 ? 'var(--success)' : pront >= 40 ? 'var(--warning)' : 'var(--danger)');
    setIdx('idxIntensity', intens + '%', 'var(--warning)');
}

function setIdx(id, val, color) {
    const e = document.getElementById(id);
    if (e) { e.textContent = val; e.style.color = color; }
}

/**
 * Multi-variable AI Analysis Engine with 3 Structured Neurophysiological Blocks
 */
function runAIAnalysis() {
    const data = getData(), el = document.getElementById('aiText');
    if (!el) return;
    if (!data || !data.length) {
        el.innerHTML = 'Sem dados suficientes. Preencha o questionário ou registre treinos para gerar a análise.';
        return;
    }

    const L = data[data.length - 1];

    // Extract metrics with fallbacks
    const rec = CL(L.recuperacao || 0, 0, 100);
    const pront = CL(L.prontidao || 0, 0, 100);
    const tss = L.tss || 0;
    const trimp = L.trimp || 0;
    const atl = L.atl || 0;
    const ctl = L.ctl || 0;
    const tsb = L.tsb || 0;
    const mono = L.monotonia || 0;
    const pse = L.pse || 0;
    const hrv = L.hrv || 0;
    const fcmedia = L.fcmedia || 0;
    const hooper = L.hooper || 0;
    const tqr = L.tqr || 13;
    const prs = L.prs || 5;
    const dor = L.dor || 0;
    const sonoQ = L.sonoQ || 3;
    const sonoH = L.sonoH || 7;
    const motivacao = L.motivacao || 7;

    let html = '';

    // 1. Visão Geral da Prontidão e Recuperação
    html += '<div style="margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.08)">';
    if (rec >= 70 && pront >= 70) {
        html += '🟢 <strong>Estado Geral: Alta Capacidade de Performance</strong><br>';
        html += 'Sistema neurovegetativo equilibrado e alta capacidade de mobilização de unidades motoras. Momento ideal para treinos de alta intensidade (Z4/Z5, cargas elevadas).';
    } else if (rec >= 45 && pront >= 45) {
        html += '🟡 <strong>Estado Geral: Adaptação & Transição Intermediária</strong><br>';
        html += 'O organismo está processando as cargas recentes. Treino mantido na zona planejada, com monitoramento atento à percepção de esforço.';
    } else {
        html += '🔴 <strong>Estado Geral: Fadiga Acumulada / Alerta de Recuperação</strong><br>';
        html += 'Depressão temporária da prontidão neural e metabólica. Recomenda-se treino regenerativo ativo ou descanso total.';
    }
    html += '</div>';

    // 2. Correlação das Variáveis (Carga, Estresse e Autonômico)
    html += '<div style="margin-bottom:16px;">';
    html += '📊 <strong>Correlação Inter-Variáveis:</strong><br>';
    html += '<ul style="margin-left:18px;margin-top:6px;line-height:1.7">';

    html += `<li><strong>Carga & Estresse (Banister):</strong> Agudo (ATL: ${atl}) vs Crônico (CTL: ${ctl}) → Balanço TSB: <strong>${tsb}</strong>. `;
    if (tsb < -20) {
        html += 'Sobrecarga aguda significativa. Atenção ao risco de overreaching não-funcional se mantido por múltiplos dias.';
    } else if (tsb >= -20 && tsb <= 5) {
        html += 'Estímulo ótimo para ganho de aptidão cardiovascular e neuromuscular.';
    } else {
        html += 'Fase de polimento / recuperação (Tapering). Organismo revigorado com TSB positivo.';
    }
    html += '</li>';

    if (mono >= 1.8) {
        html += `<li>⚠️ <strong>Monotonia Elevada (${mono}):</strong> Treino muito homogêneo. Risco aumentado de estagnação e queda de imunidade.</li>`;
    }

    if (hrv > 0 || fcmedia > 0) {
        html += `<li><strong>Modulação Autonômica (SNA):</strong> HRV (rMSSD): <strong>${hrv ? hrv + ' ms' : 'N/I'}</strong> | FC Média: <strong>${fcmedia ? fcmedia + ' bpm' : 'N/I'}</strong>. `;
        if (hrv < 40 && hrv > 0) {
            html += 'Redução no tônus parassimpático (vagal), indicando estresse autonômico residual.';
        } else if (hrv >= 40) {
            html += 'Tônus vagal elevado, favorecendo a variabilidade cardíaca e a regeneração celular.';
        }
        html += '</li>';
    }

    html += `<li><strong>Indicadores Subjetivos:</strong> Hooper: <strong>${hooper}/28</strong> | TQR: <strong>${tqr}/20</strong> | PRS: <strong>${prs}/10</strong> | Sono: <strong>${sonoH}h (Q${sonoQ}/5)</strong> | Dor: <strong>${dor}/10</strong> | Motivação: <strong>${motivacao}/10</strong>.</li>`;
    html += '</ul>';
    html += '</div>';

    // 3. TRÊS BLOCOS DE ANÁLISE NEUROFISIOLÓGICA
    html += '<div style="display:flex;flex-direction:column;gap:12px;">';

    // BLOCO 1: ADAPTAÇÕES DO TREINAMENTO
    html += '<div style="background:rgba(124,58,237,0.12);padding:14px 16px;border-radius:12px;border-left:4px solid var(--primary)">';
    html += '🧠 <strong>Bloco 1: Adaptações do Treinamento</strong><br>';
    html += '<p style="margin-top:6px;font-size:13px;line-height:1.6;color:var(--text)">';
    if (ctl >= 40) {
        html += `Com uma carga crônica acumulada (CTL ${ctl}), o sistema neuromuscular apresenta consolidação de vias motoras e maior sincronização de disparos de motoneurônios alfa. Ocorreu aumento no recrutamento de unidades motoras de alto limiar (fibras IIa/IIb) e biogênese mitocondrial otimizada, permitindo maior densidade de capilares e taxa de extração metabólica de oxigênio.`;
    } else {
        html += `A carga crônica atual (CTL ${ctl}) indica fase inicial ou intermediária de sinalização adaptativa. O estresse tensional/metabólico induziu transcrição de fatores miogênicos (mTOR / PGC-1α), dando início ao fortalecimento da junção neuromuscular e hipertrofia de miofibrilas musculares.`;
    }
    html += '</p></div>';

    // BLOCO 2: ADAPTAÇÕES NOS PROCESSOS DE FADIGA
    html += '<div style="background:rgba(6,182,212,0.12);padding:14px 16px;border-radius:12px;border-left:4px solid var(--secondary)">';
    html += '⚡ <strong>Bloco 2: Adaptações nos Processos de Fadiga</strong><br>';
    html += '<p style="margin-top:6px;font-size:13px;line-height:1.6;color:var(--text)">';
    if (rec >= 65 && hooper < 15) {
        html += `Fadiga central e periférica sob controle (Hooper ${hooper}/28, Dor ${dor}/10). O eixo Hipotálamo-Hipófise-Adrenal (HPA) mantém níveis adequados de cortisol, evitando o catabolismo. A modulação do Sistema Nervoso Autônomo ${hrv ? '(HRV ' + hrv + 'ms)' : ''} demonstra restauração da sensibilidade dos receptores β-adrenérgicos e rápido clearance de metabólitos lactáticos.`;
    } else {
        html += `Presença de fadiga central e periférica proeminente (Hooper ${hooper}/28, Dor ${dor}/10). A sinalização contínua por vias aferentes de nociceptores grupo III/IV reduz a frequência máxima de disparo neural (motoneurônios alfa). A privação ou qualidade do sono (Q${sonoQ}/5, ${sonoH}h) diminui a depuração glinfática do SNC e reduz a taxa de ressíntese de glicogênio.`;
    }
    html += '</p></div>';

    // BLOCO 3: ADAPTAÇÕES PARA O PRÓXIMO CICLO
    html += '<div style="background:rgba(16,185,129,0.12);padding:14px 16px;border-radius:12px;border-left:4px solid var(--success)">';
    html += '🎯 <strong>Bloco 3: Adaptações para o Próximo Ciclo</strong><br>';
    html += '<p style="margin-top:6px;font-size:13px;line-height:1.6;color:var(--text)">';
    if (pront >= 65 && tsb >= -15) {
        html += `<strong>Diretriz do Ciclo: Progressão Carga / Alta Intensidade.</strong> Prontidão (${pront}/100) e TSB (${tsb}) favoráveis. A janela de supercompensação está aberta. Recomenda-se avançar o volume/intensidade com foco em força máxima, hipertrofia ou potência (Z4/Z5), aproveitando a ressíntese proteica ativada.`;
    } else if (pront >= 45) {
        html += `<strong>Diretriz do Ciclo: Manutenção / Carga Controlada.</strong> Prontidão em nível intermediário (${pront}/100). Recomenda-se manter o microciclo em intensidade moderada (Z2/Z3), evitando falhas concêntricas extremas para otimizar o tempo de meia-vida do reparo tecidual antes do próximo pico de carga.`;
    } else {
        html += `<strong>Diretriz do Ciclo: Regeneração Ativa / Descanso (Deload).</strong> Prontidão deprimida (${pront}/100, TSB ${tsb}). Recomenda-se um ciclo de descarga ativa (mobilidade, caminhada leve ou regenerativo Z1) por 24-48h para restabelecer o balanço anabólico/catabólico e prevenir sobrecarga miofascial.`;
    }
    html += '</p></div>';

    html += '</div>';

    el.innerHTML = html;
}

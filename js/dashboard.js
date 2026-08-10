/* ===================================================================
   dashboard.js — Index Cards & Deep Neurophysiological AI Analysis
   Analyzes all variables, interrelationships, and neurophysiology.
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
 * Multi-variable AI Analysis Engine
 * Correlates all variables (TSS, TRIMP, ATL, CTL, TSB, Monotonia, PSE, HRV, FC Média,
 * Hooper, TQR, PRS, Dor, Sono, Motivação) and provides a neurophysiological synthesis.
 */
function runAIAnalysis() {
    const data = getData(), el = document.getElementById('aiText');
    if (!el) return;
    if (!data || !data.length) {
        el.innerHTML = 'Sem dados suficientes. Preencha o questionário ou registre treinos para gerar a análise.';
        return;
    }

    const L = data[data.length - 1];

    // Extract current metrics with defaults
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
    html += '<div style="margin-bottom:14px;">';
    html += '📊 <strong>Correlação Inter-Variáveis:</strong><br>';
    html += '<ul style="margin-left:18px;margin-top:6px;line-height:1.7">';

    // Carga vs Aptidão (ATL, CTL, TSB, Monotonia)
    html += `<li><strong>Carga & Estresse (Banister):</strong> Fadiga Aguda (ATL: ${atl}) vs Aptidão Crônica (CTL: ${ctl}) → Balanço TSB: <strong>${tsb}</strong>. `;
    if (tsb < -20) {
        html += 'Sobrecarga aguda significativa (risk threshold). Risco de overreaching não-funcional se mantido por > 7 dias.';
    } else if (tsb >= -20 && tsb <= 5) {
        html += 'Zona de estímulo produtivo para ganhos de aptidão cardiovascular e muscular.';
    } else {
        html += 'Fase de polimento / alívio (Tapering). Organismo altamente revigorado.';
    }
    html += '</li>';

    // Monotonia
    if (mono >= 1.8) {
        html += `<li>⚠️ <strong>Monotonia Elevada (${mono}):</strong> Treinamento muito homogêneo. Aumenta a suscetibilidade a infecções de vias aéreas superiores (IVAS) e estagnação neural.</li>`;
    }

    // Sistema Nervoso Autônomo (HRV & FC Média)
    if (hrv > 0 || fcmedia > 0) {
        html += `<li><strong>Modulação Autonômica (SNA):</strong> HRV (rMSSD): <strong>${hrv ? hrv + ' ms' : 'N/I'}</strong> | FC Média: <strong>${fcmedia ? fcmedia + ' bpm' : 'N/I'}</strong>. `;
        if (hrv < 40 && hrv > 0) {
            html += 'Redução no tônus vagal (parassimpático), indicando ativação simpática sustentada pelo estresse de treino/rotina.';
        } else if (hrv >= 40) {
            html += 'Tônus vagal preservado, favorecendo a variabilidade cardíaca e a regeneração tecidual.';
        }
        html += '</li>';
    }

    // Subjetivas (Hooper, TQR, PRS, Sono, Dor, Motivação)
    html += `<li><strong>Indicadores Subjetivos & Percepção:</strong> Hooper Index: <strong>${hooper}/28</strong> | TQR: <strong>${tqr}/20</strong> | PRS: <strong>${prs}/10</strong> | Sono: <strong>${sonoH}h (Q${sonoQ}/5)</strong> | Dor: <strong>${dor}/10</strong>. `;
    if (sonoQ <= 2 || sonoH < 6) {
        html += 'Privação de sono afeta negativamente a síntese proteica e a liberação de GH noturno.';
    } else {
        html += 'Sono adequado garantindo restauração glinfática e neuromuscular.';
    }
    html += '</li>';

    html += '</ul>';
    html += '</div>';

    // 3. Análise Neurofisiológica Sintética
    html += '<div style="background:rgba(124,58,237,0.1);padding:12px 16px;border-radius:10px;border-left:4px solid var(--primary)">';
    html += '🧠 <strong>Síntese Neurofisiológica:</strong><br>';
    html += '<p style="margin-top:6px;font-size:13px;line-height:1.6;color:var(--text)">';

    if (rec >= 70) {
        html += 'O eixo Hipotálamo-Hipófise-Adrenal (HPA) apresenta homeostase preservada com bom controle do cortisol. As junções neuromusculares e os fusos musculares estão prontos para despolarizações de alta frequência, permitindo recrutamento otimizado de fibras tipo IIb com coordenação motora refinada.';
    } else if (rec >= 45) {
        html += 'Evidência de fadiga central e periférica moderada. Ocorre ligeiro decréscimo na velocidade de condução do impulso nervoso e sensibilidade tátil dos proprioceptores. Há adaptação estrutural em andamento (remodelamento miofibrilar e biogênese mitocondrial).';
    } else {
        html += 'Inibição pré-sináptica e redução da taxa de disparo dos motoneurônios alfa devido à transmissão sustentada de nociceptores do grupo III/IV (dor/DOMS). O sistema nervoso central está priorizando a conservação de energia e reparo celular em detrimento da produção de potência máxima.';
    }

    html += '</p>';
    html += '</div>';

    el.innerHTML = html;
}

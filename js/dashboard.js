/* ===================================================================
   dashboard.js — Index Cards & AI Analysis (WHOOP / Athlytic UI Engine)
   =================================================================== */

function updateIndices(data) {
    if (!data || !data.length) return;
    const L = data[data.length - 1];

    const rec = CL(L.recuperacao || 0, 0, 100);
    const pront = CL(L.prontidao || 0, 0, 100);
    const sonoQ = CL((L.sonoQ || 3) * 20, 0, 100);
    const sonoH = L.sonoH || 7;
    const tss = L.tss || 0;
    const atl = L.atl || 0;
    const exertion = +(pront / 10).toFixed(1); // 0-10 scale

    // Update Hero Pill & Headline
    const heroPill = document.getElementById('heroPill');
    const heroHeadline = document.getElementById('heroHeadline');
    const heroDesc = document.getElementById('heroDesc');

    if (rec >= 70) {
        if (heroPill) { heroPill.className = 'status-pill'; heroPill.innerHTML = '● GREEN LIGHT, LET\'S GO!'; }
        if (heroHeadline) heroHeadline.textContent = 'Pronto para Superar.';
    } else if (rec >= 45) {
        if (heroPill) { heroPill.className = 'status-pill amber'; heroPill.innerHTML = '● AMBER LIGHT — ESTÁVEL'; }
        if (heroHeadline) heroHeadline.textContent = 'Estímulo Moderado.';
    } else {
        if (heroPill) { heroPill.className = 'status-pill red'; heroPill.innerHTML = '● RED LIGHT — REGENERAÇÃO'; }
        if (heroHeadline) heroHeadline.textContent = 'Priorize Descanso.';
    }

    if (heroDesc) {
        heroDesc.innerHTML = `Sua recuperação está em <strong>${rec}%</strong> e seu sono durou <strong>${sonoH}h</strong>. Seu balanço de carga (TSB: ${L.tsb || 0}) indica uma janela ${rec >= 70 ? 'excelente para ganho de performance.' : 'de restauração metabólica.'}`;
    }

    // 1. RECOVERY Metric Card
    const valRec = document.getElementById('valRec');
    const subRec = document.getElementById('subRec');
    const barRec = document.getElementById('barRec');
    if (valRec) valRec.innerHTML = `${rec}<span>%</span>`;
    if (subRec) subRec.textContent = rec >= 70 ? 'Pronto para Treino' : rec >= 45 ? 'Moderado' : 'Atenção';
    if (barRec) {
        barRec.style.width = `${rec}%`;
        barRec.style.background = rec >= 70 ? 'var(--green)' : rec >= 45 ? 'var(--orange)' : 'var(--red)';
    }

    // 2. SLEEP Metric Card
    const valSleep = document.getElementById('valSleep');
    const subSleep = document.getElementById('subSleep');
    const barSleep = document.getElementById('barSleep');
    if (valSleep) valSleep.innerHTML = `${sonoQ}<span>%</span>`;
    if (subSleep) subSleep.textContent = `${sonoH}h de sono`;
    if (barSleep) {
        barSleep.style.width = `${sonoQ}%`;
        barSleep.style.background = 'var(--indigo)';
    }

    // 3. EXERTION / PRONTIDÃO Metric Card
    const valExertion = document.getElementById('valExertion');
    const subExertion = document.getElementById('subExertion');
    const barExertion = document.getElementById('barExertion');
    if (valExertion) valExertion.innerHTML = `${exertion}<span>/10</span>`;
    if (subExertion) subExertion.textContent = exertion >= 7 ? 'Carga Alta Alvo' : exertion >= 4 ? 'Carga Média' : 'Minimal';
    if (barExertion) {
        barExertion.style.width = `${exertion * 10}%`;
        barExertion.style.background = 'var(--cyan)';
    }

    // Target range indicator on Exertion card
    const targetBand = document.getElementById('targetBand');
    if (targetBand) {
        targetBand.style.left = '45%';
        targetBand.style.width = '30%';
    }

    // 4. CARGA / ENERGY Metric Card
    const valEnergy = document.getElementById('valEnergy');
    const subEnergy = document.getElementById('subEnergy');
    const barEnergy = document.getElementById('barEnergy');
    if (valEnergy) valEnergy.innerHTML = `${tss > 0 ? tss : atl}<span> TSS</span>`;
    if (subEnergy) subEnergy.textContent = `ATL: ${atl} | CTL: ${L.ctl || 0}`;
    if (barEnergy) {
        barEnergy.style.width = `${Math.min(100, (tss || atl) / 1.5)}%`;
        barEnergy.style.background = 'var(--orange)';
    }
}

/**
 * Multi-variable AI Analysis Engine with 3 Structured Neurophysiological Blocks
 */
function runAIAnalysis() {
    const data = getData(), el = document.getElementById('aiBlocks');
    if (!el) return;
    if (!data || !data.length) {
        el.innerHTML = '<div class="card">Sem dados suficientes. Preencha o questionário ou registre treinos.</div>';
        return;
    }

    const L = data[data.length - 1];

    const rec = CL(L.recuperacao || 0, 0, 100);
    const pront = CL(L.prontidao || 0, 0, 100);
    const atl = L.atl || 0;
    const ctl = L.ctl || 0;
    const tsb = L.tsb || 0;
    const hrv = L.hrv || 0;
    const hooper = L.hooper || 0;
    const dor = L.dor || 0;
    const sonoQ = L.sonoQ || 3;
    const sonoH = L.sonoH || 7;

    let html = '';

    // BLOCO 1: ADAPTAÇÕES DO TREINAMENTO
    html += '<div class="ai-block b1">';
    html += '<div class="ai-block-title" style="color:var(--indigo)">🧠 Bloco 1: Adaptações do Treinamento</div>';
    html += '<div class="ai-block-text">';
    if (ctl >= 40) {
        html += `Com uma carga crônica acumulada (CTL ${ctl}), o sistema neuromuscular apresenta consolidação de vias motoras e maior sincronização de disparos de motoneurônios alfa. Ocorreu aumento no recrutamento de unidades motoras de alto limiar (fibras IIa/IIb) e biogênese mitocondrial otimizada.`;
    } else {
        html += `A carga crônica atual (CTL ${ctl}) indica fase inicial/intermediária de sinalização adaptativa. O estresse tensional/metabólico induziu transcrição de fatores miogênicos (mTOR / PGC-1α), estimulando hipertrofia miofibrilar.`;
    }
    html += '</div></div>';

    // BLOCO 2: ADAPTAÇÕES NOS PROCESSOS DE FADIGA
    html += '<div class="ai-block b2">';
    html += '<div class="ai-block-title" style="color:var(--cyan)">⚡ Bloco 2: Adaptações nos Processos de Fadiga</div>';
    html += '<div class="ai-block-text">';
    if (rec >= 65 && hooper < 15) {
        html += `Fadiga central e periférica sob controle (Hooper ${hooper}/28, Dor ${dor}/10). O eixo HPA mantém níveis homeostáticos de cortisol. A modulação autonômica ${hrv ? '(HRV ' + hrv + 'ms)' : ''} demonstra tônus vagal preservado e rápida remoção de metabólitos.`;
    } else {
        html += `Fadiga central e periférica presente (Hooper ${hooper}/28, Dor ${dor}/10). A sinalização por nociceptores aferentes grupo III/IV reduz temporariamente a frequência máxima de disparo neural. O sono (${sonoH}h, Q${sonoQ}/5) é fator determinante para restauração glinfática.`;
    }
    html += '</div></div>';

    // BLOCO 3: ADAPTAÇÕES PARA O PRÓXIMO CICLO
    html += '<div class="ai-block b3">';
    html += '<div class="ai-block-title" style="color:var(--green)">🎯 Bloco 3: Adaptações para o Próximo Ciclo</div>';
    html += '<div class="ai-block-text">';
    if (pront >= 65 && tsb >= -15) {
        html += `<strong>Diretriz: Progressão de Carga / Alta Intensidade.</strong> Prontidão (${pront}/100) e TSB (${tsb}) favoráveis. A janela de supercompensação está aberta para ganhos de potência e força.`;
    } else if (pront >= 45) {
        html += `<strong>Diretriz: Manutenção / Carga Controlada.</strong> Prontidão moderada (${pront}/100). Recomenda-se manter treinos em intensidade controlada para otimizar a regeneração.`;
    } else {
        html += `<strong>Diretriz: Regeneração Ativa / Descanso (Deload).</strong> Prontidão deprimida (${pront}/100). Recomenda-se ciclo de descanso ativo por 24-48h.`;
    }
    html += '</div></div>';

    el.innerHTML = html;
}

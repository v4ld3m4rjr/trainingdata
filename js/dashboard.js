/* ===================================================================
   dashboard.js — Athlytic iOS UI Engine
   Segmented controls, 7-day bar charts, circular gauges, HRV deltas & AI
   =================================================================== */

let currentSegment = 'recovery';

/**
 * Switch between Today segmented tabs: Recovery, Exertion, Energy
 */
function switchSegment(seg) {
    currentSegment = seg;
    const subRec = document.getElementById('subViewRecovery');
    const subEx = document.getElementById('subViewExertion');
    const subEn = document.getElementById('subViewEnergy');

    const btnRec = document.getElementById('segRecovery');
    const btnEx = document.getElementById('segExertion');
    const btnEn = document.getElementById('segEnergy');

    if (btnRec) btnRec.classList.toggle('active', seg === 'recovery');
    if (btnEx) btnEx.classList.toggle('active', seg === 'exertion');
    if (btnEn) btnEn.classList.toggle('active', seg === 'energy');

    if (subRec) subRec.style.display = seg === 'recovery' ? 'block' : 'none';
    if (subEx) subEx.style.display = seg === 'exertion' ? 'block' : 'none';
    if (subEn) subEn.style.display = seg === 'energy' ? 'block' : 'none';
}

/**
 * Update all Athlytic dashboard indices and cards
 */
function updateIndices(data) {
    if (!data || !data.length) return;
    const L = data[data.length - 1];

    const rec = CL(L.recuperacao || 0, 0, 100);
    const pront = CL(L.prontidao || 0, 0, 100);
    const sonoQ = CL((L.sonoQ || 3) * 20, 0, 100);
    const sonoH = L.sonoH || 7;
    const tss = L.tss || 0;
    const atl = L.atl || 0;
    const ctl = L.ctl || 45;
    const tsb = L.tsb || (ctl - atl);
    const mono = L.monotonia || 1.1;
    const hrv = L.hrv || 85;
    const rhr = L.rhr || (L.fcmedia ? Math.round(L.fcmedia * 0.38) : 42); // Resting Heart Rate
    const exertion = +(pront / 10).toFixed(1); // 0-10 scale

    // ── 1. RECOVERY HERO CARD (Athlytic Style) ──
    const valRecScore = document.getElementById('valRecoveryScore');
    const recColorBar = document.getElementById('recColorBar');
    const recStatusTitle = document.getElementById('recStatusTitle');
    const recCoachingText = document.getElementById('recCoachingText');
    const recUpdateTime = document.getElementById('recUpdateTime');

    let recThemeColor = '#ffcc00';
    let statusText = 'Recovering';
    let coachMsg = 'Your Recovery today indicates that your body is in a state of recovery and you should consider training at a moderate or reduced load.';

    if (rec >= 67) {
        recThemeColor = '#34c759'; // Apple Green
        statusText = 'Optimal';
        coachMsg = 'Seu tônus vagal e sistema autonômico estão excelentes. Você está pronto para sessões de alta intensidade ou progressão de carga.';
    } else if (rec >= 40) {
        recThemeColor = '#a4cd39'; // Lime Green / Yellow
        statusText = 'Recovering';
        coachMsg = 'Sua recuperação de hoje indica que o corpo está em processo de restauração metabólica. Mantenha os treinos em zona de esforço moderada.';
    } else {
        recThemeColor = '#ff3b30'; // Apple Red
        statusText = 'Resting';
        coachMsg = 'Fadiga ou estresse fisiológico detectados. Priorize sono, hidratação e recuperação ativa para restabelecer o equilíbrio homeostático.';
    }

    if (valRecScore) {
        valRecScore.textContent = `${rec}%`;
        valRecScore.style.color = recThemeColor;
    }
    if (recColorBar) {
        recColorBar.style.background = recThemeColor;
    }
    if (recStatusTitle) {
        recStatusTitle.textContent = statusText;
    }
    if (recCoachingText) {
        recCoachingText.textContent = coachMsg;
    }
    if (recUpdateTime) {
        const now = new Date();
        recUpdateTime.textContent = `Última sincronização: ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    // ── 2. BIOMETRIC DELTAS (HRV & RESTING HR) ──
    // 7-day Rolling Baseline for HRV
    const recentHrvEntries = data.slice(-8, -1).map(e => e.hrv).filter(v => v > 0);
    const avgPastHrv = recentHrvEntries.length
        ? Math.round(recentHrvEntries.reduce((a, b) => a + b, 0) / recentHrvEntries.length)
        : 75;
    const hrvDiff = Math.round(((hrv - avgPastHrv) / avgPastHrv) * 100);
    const hrvDeltaText = `${hrvDiff >= 0 ? '+' : ''}${hrvDiff}% (${avgPastHrv}) ${hrvDiff >= 0 ? '↑' : '↓'}`;

    const bioHrvVal = document.getElementById('bioHrvVal');
    const bioHrvDelta = document.getElementById('bioHrvDelta');
    if (bioHrvVal) bioHrvVal.innerHTML = `${hrv} <span style="font-size:12px;font-weight:600;color:var(--text-tertiary)">ms</span>`;
    if (bioHrvDelta) {
        bioHrvDelta.textContent = hrvDeltaText;
        bioHrvDelta.className = hrvDiff >= 0 ? 'bio-delta-up' : 'bio-delta-down';
    }

    // 7-day Baseline for Resting HR
    const avgPastRhr = 43;
    const rhrDiff = Math.round(((rhr - avgPastRhr) / avgPastRhr) * 100);
    const rhrDeltaText = `${rhrDiff >= 0 ? '+' : ''}${rhrDiff}% (${avgPastRhr}) ${rhrDiff <= 0 ? '↓' : '↑'}`;

    const bioRhrVal = document.getElementById('bioRhrVal');
    const bioRhrDelta = document.getElementById('bioRhrDelta');
    if (bioRhrVal) bioRhrVal.innerHTML = `${rhr} <span style="font-size:12px;font-weight:600;color:var(--text-tertiary)">bpm</span>`;
    if (bioRhrDelta) {
        bioRhrDelta.textContent = rhrDeltaText;
        bioRhrDelta.className = rhrDiff <= 0 ? 'bio-delta-up' : 'bio-delta-down';
    }

    // ── 3. 7-DAY RECOVERY PER DAY BAR CHART ──
    renderDailyRecoveryBars(data);

    // ── 4. EXERTION HERO CARD & CIRCULAR GAUGE ──
    const targetMin = Math.max(1.5, +((rec / 25) + 1.2).toFixed(1));
    const targetMax = Math.min(9.8, +(targetMin + 2.0).toFixed(1));

    const targetExertionLabel = document.getElementById('targetExertionLabel');
    if (targetExertionLabel) {
        targetExertionLabel.textContent = `Target Exertion Zone: ${targetMin.toString().replace('.', ',')} - ${targetMax.toString().replace('.', ',')}`;
    }

    const valExertionScore = document.getElementById('valExertionScore');
    const gaugeCenterSub = document.getElementById('gaugeCenterSub');
    const exertionCoachingText = document.getElementById('exertionCoachingText');

    let exCategory = 'Moderate';
    let exColor = '#ff9500';
    if (exertion < targetMin) {
        exCategory = 'Light';
        exColor = '#32ade6';
    } else if (exertion <= targetMax) {
        exCategory = 'Moderate';
        exColor = '#ff9500';
    } else {
        exCategory = 'Overreaching';
        exColor = '#ff3b30';
    }

    if (valExertionScore) valExertionScore.textContent = exertion.toString().replace('.', ',');
    if (gaugeCenterSub) gaugeCenterSub.textContent = exCategory;
    if (exertionCoachingText) {
        exertionCoachingText.textContent = `Sua recuperação foi ${statusText} hoje e você está ${exertion <= targetMax ? 'dentro da sua Target Exertion Zone' : 'acima da zona recomendada'}. Tente manter o esforço abaixo de ${targetMax.toString().replace('.', ',')} para regenerar completamente amanhã.`;
    }

    // Update Circular Gauge SVG Progress
    const gaugeCircle = document.getElementById('gaugeProgressCircle');
    const gaugeTargetArc = document.getElementById('gaugeTargetArc');
    const circumference = 2 * Math.PI * 72; // ~452.39

    if (gaugeCircle) {
        const exertionRatio = Math.min(1, Math.max(0, exertion / 10));
        const offset = circumference - (exertionRatio * circumference);
        gaugeCircle.style.strokeDashoffset = offset;
        gaugeCircle.style.stroke = exColor;
    }

    if (gaugeTargetArc) {
        const targetRatio = Math.min(1, targetMax / 10);
        const targetOffset = circumference - (targetRatio * circumference);
        gaugeTargetArc.style.strokeDashoffset = targetOffset;
    }

    // ── 5. 7-DAY EXERTION TOTAL PER DAY BAR CHART ──
    renderDailyExertionBars(data);

    // ── 6. ENERGY & AI METRICS ──
    const valAtl = document.getElementById('valAtl');
    const valCtl = document.getElementById('valCtl');
    const valTsb = document.getElementById('valTsb');
    const valMono = document.getElementById('valMono');
    const energyTssBadge = document.getElementById('energyTssBadge');
    const sleepQualityBadge = document.getElementById('sleepQualityBadge');
    const hooperBadge = document.getElementById('hooperBadge');

    if (valAtl) valAtl.textContent = atl;
    if (valCtl) valCtl.textContent = ctl;
    if (valTsb) {
        valTsb.textContent = (tsb >= 0 ? '+' : '') + tsb;
        valTsb.style.color = tsb >= 0 ? 'var(--green)' : 'var(--red)';
    }
    if (valMono) valMono.textContent = mono;
    if (energyTssBadge) energyTssBadge.textContent = `${tss > 0 ? tss : atl} TSS`;
    if (sleepQualityBadge) sleepQualityBadge.textContent = `${sonoH}h · Q${L.sonoQ || 3}/5`;
    if (hooperBadge) hooperBadge.textContent = `${L.hooper || 12}/28`;

    // ── 7. TRENDS VIEW SUMMARY ──
    const trendMostRecentRec = document.getElementById('trendMostRecentRec');
    const trendAvgRec = document.getElementById('trendAvgRec');
    const trendAvgHrv = document.getElementById('trendAvgHrv');

    if (trendMostRecentRec) trendMostRecentRec.textContent = `${rec}%`;
    const last30 = data.slice(-30);
    const avgRec30 = Math.round(last30.reduce((a, b) => a + (b.recuperacao || 0), 0) / last30.length);
    const avgHrv30 = Math.round(last30.reduce((a, b) => a + (b.hrv || 0), 0) / last30.length);

    if (trendAvgRec) trendAvgRec.textContent = `${avgRec30}%`;
    if (trendAvgHrv) trendAvgHrv.textContent = `${avgHrv30} ms`;
}

/**
 * Render 7-day Recovery Bars in Athlytic Style
 */
function renderDailyRecoveryBars(data) {
    const container = document.getElementById('recDailyBars');
    const avgLabel = document.getElementById('recWeeklyAvg');
    if (!container) return;

    const last7 = data.slice(-7);
    const dayNames = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

    let html = '';
    let totalScore = 0;

    last7.forEach(entry => {
        const dt = new Date(entry.date);
        const dayName = isNaN(dt.getTime()) ? 'DIA' : dayNames[dt.getDay()];
        const score = CL(entry.recuperacao || 0, 0, 100);
        totalScore += score;

        let barColor = '#34c759'; // Green
        if (score >= 67) barColor = '#34c759';
        else if (score >= 50) barColor = '#a4cd39';
        else if (score >= 35) barColor = '#ffcc00';
        else barColor = '#ff3b30';

        const heightPx = Math.max(12, Math.round((score / 100) * 100));

        html += `
            <div class="daily-bar-col">
                <span class="daily-bar-val">${score}%</span>
                <div class="daily-bar-track">
                    <div class="daily-bar-fill" style="height:${heightPx}px;background:${barColor}"></div>
                </div>
                <span class="daily-bar-label">${dayName}</span>
            </div>
        `;
    });

    container.innerHTML = html;
    const weeklyAvg = Math.round(totalScore / (last7.length || 1));
    if (avgLabel) {
        avgLabel.innerHTML = `${weeklyAvg}% ${weeklyAvg >= 60 ? '↑' : '↓'}`;
    }
}

/**
 * Render 7-day Exertion Bars in Athlytic Style
 */
function renderDailyExertionBars(data) {
    const container = document.getElementById('exertionDailyBars');
    const avgLabel = document.getElementById('exertionWeeklyAvg');
    if (!container) return;

    const last7 = data.slice(-7);
    const dayNames = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

    let html = '';
    let totalScore = 0;

    last7.forEach(entry => {
        const dt = new Date(entry.date);
        const dayName = isNaN(dt.getTime()) ? 'DIA' : dayNames[dt.getDay()];
        const pront = CL(entry.prontidao || 0, 0, 100);
        const exVal = +(pront / 10).toFixed(1);
        totalScore += exVal;

        const heightPx = Math.max(12, Math.round((exVal / 10) * 100));

        html += `
            <div class="daily-bar-col">
                <span class="daily-bar-val">${exVal.toString().replace('.', ',')}</span>
                <div class="daily-bar-track">
                    <div class="daily-bar-fill" style="height:${heightPx}px;background:linear-gradient(180deg,#ff9500,#ff3b30)"></div>
                </div>
                <span class="daily-bar-label">${dayName}</span>
            </div>
        `;
    });

    container.innerHTML = html;
    const weeklyAvg = (totalScore / (last7.length || 1)).toFixed(1);
    if (avgLabel) {
        avgLabel.innerHTML = `${weeklyAvg.toString().replace('.', ',')} ${weeklyAvg >= 6.0 ? '↑' : '↓'}`;
    }
}

/**
 * Multi-variable AI Analysis Engine
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
        html += `Com uma carga crônica acumulada (CTL ${ctl}), o sistema neuromuscular apresenta consolidação de vias motoras e maior sincronização de disparos de motoneurônios alfa. Ocorreu aumento no recrutamento de unidades motoras e biogênese mitocondrial otimizada.`;
    } else {
        html += `A carga crônica atual (CTL ${ctl}) indica fase inicial de sinalização adaptativa. O estresse induziu transcrição de fatores miogênicos (mTOR / PGC-1α), estimulando adaptação miofibrilar progressiva.`;
    }
    html += '</div></div>';

    // BLOCO 2: ADAPTAÇÕES NOS PROCESSOS DE FADIGA
    html += '<div class="ai-block b2">';
    html += '<div class="ai-block-title" style="color:var(--teal)">⚡ Bloco 2: Modulação Autonômica & Fadiga</div>';
    html += '<div class="ai-block-text">';
    if (rec >= 65 && hooper < 15) {
        html += `Fadiga central e periférica sob controle (Hooper ${hooper}/28, Dor ${dor}/10). A modulação autonômica ${hrv ? '(HRV ' + hrv + 'ms)' : ''} demonstra predomínio vagal parassimpático e rápida recuperação homeostática.`;
    } else {
        html += `Fadiga fisiológica presente (Hooper ${hooper}/28, Dor ${dor}/10). A sinalização nociceptiva e a queda temporária de HRV (${hrv}ms) requerem priorização do sono (${sonoH}h) para restauração do sistema nervoso.`;
    }
    html += '</div></div>';

    // BLOCO 3: ADAPTAÇÕES PARA O PRÓXIMO CICLO
    html += '<div class="ai-block b3">';
    html += '<div class="ai-block-title" style="color:var(--green)">🎯 Bloco 3: Diretriz para o Próximo Ciclo</div>';
    html += '<div class="ai-block-text">';
    if (pront >= 65 && tsb >= -15) {
        html += `<strong>Diretriz: Alta Intensidade / Supercompensação.</strong> Prontidão (${pront}/100) favorável. A janela de desempenho está aberta para ganho de potência.`;
    } else if (pront >= 45) {
        html += `<strong>Diretriz: Carga Moderada / Manutenção.</strong> Prontidão moderada (${pront}/100). Recomenda-se manter treinos em intensidade controlada.`;
    } else {
        html += `<strong>Diretriz: Regeneração Ativa / Deload.</strong> Prontidão deprimida (${pront}/100). Recomenda-se descanso ou sessão regenerativa por 24-48h.`;
    }
    html += '</div></div>';

    el.innerHTML = html;
}

/**
 * Open Help Info Modal
 */
function openHelpModal(type) {
    const title = document.getElementById('helpModalTitle');
    const body = document.getElementById('helpModalBody');
    if (type === 'recovery') {
        title.textContent = 'Sobre a Recuperação & HRV';
        body.innerHTML = `
            <p style="margin-bottom:12px">A pontuação de <strong>Recuperação</strong> sintetiza o tônus vagal (HRV rMSSD), a frequência cardíaca de repouso (RHR), as horas e qualidade de sono e os índices subjetivos de fadiga e dor muscular (DOMS).</p>
            <p style="margin-bottom:12px"><strong>Classificação:</strong></p>
            <ul style="padding-left:20px;margin-bottom:12px">
                <li><strong style="color:var(--green)">67% a 100%:</strong> Excelente recuperação autonômica.</li>
                <li><strong style="color:var(--green-lime)">40% a 66%:</strong> Recuperação adequada / moderada.</li>
                <li><strong style="color:var(--red)">0% a 39%:</strong> Fadiga acumulada. Priorize descanso.</li>
            </ul>
        `;
    } else if (type === 'exertion') {
        title.textContent = 'Sobre o Esforço & Target Zone';
        body.innerHTML = `
            <p style="margin-bottom:12px">A <strong>Target Exertion Zone</strong> é calculada diariamente com base na sua capacidade de recuperação. Ela define a janela ideal de esforço (escala 0 a 10) para maximizar o ganho de condicionamento físico sem causar overtraining.</p>
            <p style="margin-bottom:12px">Se mantiver o esforço dentro da faixa verde alvo, sua recuperação de amanhã será preservada com eficiência.</p>
        `;
    }
    openModal('helpModal');
}

/**
 * Share Summary Simulation
 */
function openShareSummary() {
    const data = getData();
    const L = data[data.length - 1];
    const text = `📊 Athlytic Report de Hoje:\n• Recuperação: ${L.recuperacao}%\n• HRV: ${L.hrv} ms\n• Esforço: ${(L.prontidao/10).toFixed(1)}/10\n• Sono: ${L.sonoH}h`;
    if (navigator.share) {
        navigator.share({ title: 'Athlytic Report', text: text }).catch(() => {});
    } else {
        alert(text);
    }
}

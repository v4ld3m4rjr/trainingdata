/* ===================================================================
   dashboard.js — Dashboard Rendering
   Index cards (Recovery, Readiness, Intensity) and AI Analysis
   =================================================================== */

/**
 * Update the 3 key index cards with latest data values.
 * Colors change dynamically based on thresholds.
 */
function updateIndices(data) {
    if (!data || !data.length) return;

    const last = data[data.length - 1];
    const rec   = clamp(last.recuperacao || 0, 0, 100);
    const pront = clamp(last.prontidao || 0, 0, 100);
    const intens = clamp(Math.round(pront * 0.85 + 10), 0, 100);

    setIdx('idxRecovery',  rec,           rec >= 70 ? 'var(--success)' : rec >= 40 ? 'var(--warning)' : 'var(--danger)');
    setIdx('idxReadiness', pront,         pront >= 70 ? 'var(--success)' : pront >= 40 ? 'var(--warning)' : 'var(--danger)');
    setIdx('idxIntensity', intens + '%',  'var(--warning)');
}

/**
 * Set an index card value and color.
 */
function setIdx(id, val, color) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = val;
    el.style.color = color;
}

/**
 * Generate and display the AI analysis text based on latest data.
 * Analyzes: recovery, readiness, TSB, pain, sleep, Hooper index.
 */
function runAIAnalysis() {
    const data = getData();
    const aiEl = document.getElementById('aiText');
    if (!aiEl) return;

    if (!data.length) {
        aiEl.innerHTML = 'Sem dados. Preencha o questionário de recuperação para receber análise personalizada.';
        return;
    }

    const L     = data[data.length - 1];
    const rec   = clamp(L.recuperacao || 0, 0, 100);
    const pront = clamp(L.prontidao || 0, 0, 100);
    const tsb   = L.tsb || 0;

    let html = '<strong>Análise do Dia:</strong><br><br>';

    // Main condition assessment
    if (rec >= 70 && pront >= 70) {
        html += '✅ <strong>Condição Ótima!</strong> Recuperação e prontidão altas. Pode treinar com alta intensidade e buscar recordes pessoais.';
    } else if (rec >= 50 && pront >= 50) {
        html += '⚠️ <strong>Condição Regular.</strong> Mantenha o treino planejado mas fique atento a sinais de fadiga. Priorize hidratação e nutrição.';
    } else {
        html += '🔴 <strong>Atenção!</strong> Recuperação ou prontidão abaixo do ideal. Considere treino regenerativo ou descanso ativo.';
    }

    // TSB warnings
    if (tsb < -15) {
        html += '<br><br>📉 <strong>TSB muito negativo (' + tsb + '):</strong> Acúmulo de carga alto. Risco de overreaching — reduza intensidade.';
    }
    if (tsb > 10) {
        html += '<br><br>📈 <strong>TSB positivo (' + tsb + '):</strong> Forma fresca. Boa fase para testes ou competição.';
    }

    // Pain warning
    if ((L.dor || 0) >= 7) {
        html += '<br><br>🚨 <strong>Dor elevada detectada.</strong> Avalie possibilidade de lesão e consulte um profissional.';
    }

    // Sleep warning
    if ((L.sonoQ || 3) <= 2) {
        html += '<br><br>😴 <strong>Sono insuficiente.</strong> Priorize 7-9h de sono de qualidade.';
    }

    // Hooper overload
    if ((L.hooper || 0) >= 20) {
        html += '<br><br>⛔ <strong>Hooper Index alto (' + L.hooper + '):</strong> Estresse/fadiga acumulados. Considere dia de descanso.';
    }

    // Monotony warning
    if ((L.monotonia || 0) >= 2.0) {
        html += '<br><br>🔁 <strong>Monotonia alta (' + L.monotonia + '):</strong> Treinamento muito uniforme. Varie estímulos para evitar overtraining.';
    }

    aiEl.innerHTML = html;
}

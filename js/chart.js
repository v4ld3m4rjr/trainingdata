/* ===================================================================
   chart.js — Trends Engine
   Dynamic multi-variable trends chart with active variable chips & period toggle
   =================================================================== */

let chartInst = null;
let curPeriod = 30;
let activeVars = new Set(DEFAULT_ACTIVE_VARS);

function togglePeriodSwitch(toggleEl) {
    curPeriod = toggleEl.checked ? 30 : 7;
    const lbl = document.getElementById('periodToggleLabel');
    if (lbl) lbl.textContent = curPeriod === 30 ? '30 Day' : '7 Day';
    renderChart();
}

function buildVarChips() {
    const c = document.getElementById('varChips');
    if (!c) return;
    c.innerHTML = '';
    for (const [k, info] of Object.entries(VARS)) {
        const chip = document.createElement('div');
        const on = activeVars.has(k);
        chip.className = 'var-chip' + (on ? ' active' : '');
        chip.textContent = info.label;
        if (on) {
            chip.style.borderColor = info.color;
            chip.style.background = info.color;
            chip.style.color = '#ffffff';
        } else {
            chip.style.borderColor = '';
            chip.style.background = '';
            chip.style.color = '';
        }
        chip.addEventListener('click', function () {
            if (activeVars.has(k)) {
                activeVars.delete(k);
            } else {
                activeVars.add(k);
            }
            buildVarChips();
            renderChart();
        });
        c.appendChild(chip);
    }
}

function renderChart() {
    const canvas = document.getElementById('mainChart');
    if (!canvas) return;
    if (typeof Chart === 'undefined') return;

    if (chartInst) {
        try { chartInst.destroy(); } catch (e) { /* ignore */ }
        chartInst = null;
    }

    const all = getData();
    const sliced = all.slice(-curPeriod);
    if (!sliced.length) return;

    // Date labels
    const labels = [];
    for (let i = 0; i < sliced.length; i++) {
        const d = new Date(sliced[i].date);
        if (isNaN(d.getTime())) {
            labels.push('—');
        } else {
            labels.push(d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
        }
    }

    // Build Dynamic Datasets based on activeVars
    const datasets = [];

    if (activeVars.size === 0) {
        // Fallback if no variable is checked: show Recovery & Prontidão
        activeVars.add('Recuperacao');
        activeVars.add('Prontidao');
    }

    activeVars.forEach(function (vKey) {
        const vInfo = VARS[vKey];
        if (!vInfo) return;

        const dataPoints = sliced.map(function (e) {
            return exVar(e, vKey);
        });

        // Special styling for Recuperação (dots colored by status)
        if (vKey === 'Recuperacao') {
            const pointColors = dataPoints.map(function (r) {
                if (r >= 67) return '#34c759';
                if (r >= 40) return '#ffcc00';
                return '#ff3b30';
            });

            datasets.push({
                label: vInfo.label,
                data: dataPoints,
                borderColor: vInfo.color || '#34d399',
                backgroundColor: 'transparent',
                borderWidth: 2.5,
                pointRadius: curPeriod === 30 ? 3 : 5,
                pointHoverRadius: 7,
                pointBackgroundColor: pointColors,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1.5,
                tension: 0.35
            });
        } else {
            datasets.push({
                label: vInfo.label,
                data: dataPoints,
                borderColor: vInfo.color,
                backgroundColor: 'transparent',
                borderWidth: 2.2,
                pointRadius: curPeriod === 30 ? 2.5 : 4,
                pointHoverRadius: 6,
                pointBackgroundColor: vInfo.color,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1,
                tension: 0.35
            });
        }
    });

    try {
        chartInst = new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: { labels: labels, datasets: datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: '#1c1c1e',
                            font: { family: '-apple-system, Inter', size: 11.5, weight: '600' },
                            boxWidth: 10,
                            padding: 10,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.96)',
                        titleColor: '#000000',
                        bodyColor: '#3c3c43',
                        borderColor: '#e5e5ea',
                        borderWidth: 1,
                        cornerRadius: 12,
                        padding: 12,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        callbacks: {
                            label: function (ctx) {
                                const val = ctx.parsed.y;
                                const lbl = ctx.dataset.label || '';
                                if (lbl.includes('HRV')) return `${lbl}: ${val} ms`;
                                if (lbl.includes('FC Média')) return `${lbl}: ${val} bpm`;
                                if (lbl.includes('Recuperação') || lbl.includes('Prontidão')) return `${lbl}: ${val}%`;
                                return `${lbl}: ${val}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#8e8e93',
                            font: { size: 10.5, family: '-apple-system, Inter' },
                            maxTicksLimit: curPeriod === 30 ? 6 : 7
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.04)',
                            drawBorder: false
                        }
                    },
                    y: {
                        grace: '5%',
                        ticks: {
                            color: '#8e8e93',
                            font: { size: 10.5, family: '-apple-system, Inter' }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        }
                    }
                }
            }
        });
    } catch (err) {
        console.error('Chart render error:', err);
    }
}

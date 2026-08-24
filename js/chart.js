/* ===================================================================
   chart.js — Trends Engine
   Dual line chart (Recovery vs Exertion), shaded Target Exertion Band,
   iOS 30-day toggle switch & variable chips
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
            if (activeVars.has(k)) activeVars.delete(k);
            else activeVars.add(k);
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
    const recValues = [];
    const exertionValues = [];
    const targetMinValues = [];
    const targetMaxValues = [];
    const recPointColors = [];

    for (let i = 0; i < sliced.length; i++) {
        const d = new Date(sliced[i].date);
        if (isNaN(d.getTime())) {
            labels.push('—');
        } else {
            labels.push(d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
        }

        const r = CL(sliced[i].recuperacao || 0, 0, 100);
        // Normalize recovery to 0-10 scale for visual harmony with exertion (0-10) or display on dual axis
        const rNorm = +(r / 10).toFixed(1);
        recValues.push(rNorm);

        const ex = +((sliced[i].prontidao || 50) / 10).toFixed(1);
        exertionValues.push(ex);

        const tMin = Math.max(1.5, +((r / 25) + 1.2).toFixed(1));
        const tMax = Math.min(9.8, +(tMin + 2.0).toFixed(1));
        targetMinValues.push(tMin);
        targetMaxValues.push(tMax);

        // Point color based on recovery status
        if (r >= 67) recPointColors.push('#34c759');
        else if (r >= 40) recPointColors.push('#ffcc00');
        else recPointColors.push('#ff3b30');
    }

    // Datasets
    const datasets = [
        // Target Exertion Upper Bound (Shaded Range)
        {
            label: 'Target Range Max',
            data: targetMaxValues,
            borderColor: 'transparent',
            backgroundColor: 'rgba(142, 142, 147, 0.12)',
            fill: '+1', // Fill to Target Range Min
            pointRadius: 0,
            tension: 0.35
        },
        // Target Exertion Lower Bound
        {
            label: 'Target Exertion Range',
            data: targetMinValues,
            borderColor: 'transparent',
            backgroundColor: 'transparent',
            fill: false,
            pointRadius: 0,
            tension: 0.35
        },
        // Exertion Line (Bright Cyan/Blue)
        {
            label: 'Exertion',
            data: exertionValues,
            borderColor: '#32ade6',
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            pointRadius: curPeriod === 30 ? 2 : 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#32ade6',
            tension: 0.35
        },
        // Recovery Line (Slate Gray with status dots)
        {
            label: 'Recovery (÷10)',
            data: recValues,
            borderColor: '#8e8e93',
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            pointRadius: curPeriod === 30 ? 3.5 : 5,
            pointHoverRadius: 7,
            pointBackgroundColor: recPointColors,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 1.5,
            tension: 0.35
        }
    ];

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
                            font: { family: '-apple-system, Inter', size: 12, weight: '600' },
                            boxWidth: 12,
                            padding: 14,
                            filter: function (item) {
                                return item.text !== 'Target Range Max';
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#ffffff',
                        titleColor: '#000000',
                        bodyColor: '#6c6c70',
                        borderColor: '#e5e5ea',
                        borderWidth: 1,
                        cornerRadius: 12,
                        padding: 12,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                        callbacks: {
                            label: function (ctx) {
                                if (ctx.dataset.label === 'Recovery (÷10)') {
                                    return `Recovery: ${Math.round(ctx.parsed.y * 10)}%`;
                                }
                                if (ctx.dataset.label === 'Exertion') {
                                    return `Exertion: ${ctx.parsed.y.toFixed(1)}`;
                                }
                                if (ctx.dataset.label === 'Target Exertion Range') {
                                    return `Target Min: ${ctx.parsed.y.toFixed(1)}`;
                                }
                                return `${ctx.dataset.label}: ${ctx.parsed.y}`;
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
                        min: 0,
                        max: 10,
                        ticks: {
                            color: '#8e8e93',
                            font: { size: 10.5, family: '-apple-system, Inter' },
                            stepSize: 2
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

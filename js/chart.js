/* ===================================================================
   chart.js — Chart.js Rendering & Variable Chip Management
   Interactive multi-variable line chart with period selector
   =================================================================== */

let chartInstance = null;
let currentPeriod = 7;
let activeVars = new Set(DEFAULT_ACTIVE_VARS);

/**
 * Build the variable chip toggles above the chart.
 * Each chip toggles a dataset on/off and re-renders.
 */
function buildVarChips() {
    const container = document.getElementById('varChips');
    if (!container) return;
    container.innerHTML = '';

    for (const [key, info] of Object.entries(VARS)) {
        const chip = document.createElement('div');
        const isActive = activeVars.has(key);
        chip.className = 'var-chip' + (isActive ? ' active' : '');
        chip.textContent = info.label;

        if (isActive) {
            chip.style.borderColor = info.color;
            chip.style.background  = info.color;
        } else {
            chip.style.borderColor = '';
            chip.style.background  = '';
        }

        chip.onclick = () => {
            if (activeVars.has(key)) {
                activeVars.delete(key);
            } else {
                activeVars.add(key);
            }
            buildVarChips();
            renderChart();
        };

        container.appendChild(chip);
    }
}

/**
 * Set the chart time period and highlight the active period button.
 * @param {number} days - 7, 14, 21, or 28
 * @param {HTMLElement} btn - the clicked button element
 */
function setPeriod(days, btn) {
    currentPeriod = days;
    document.querySelectorAll('#periodBtns .btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderChart();
}

/**
 * Render the Chart.js line chart.
 * Reads data from getData(), slices by currentPeriod,
 * builds datasets for each active variable.
 */
function renderChart() {
    const canvas = document.getElementById('mainChart');
    if (!canvas) return;

    // Destroy previous instance to avoid Canvas reuse errors
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    const allData = getData();
    const sliced  = allData.slice(-currentPeriod);
    if (!sliced.length) return;

    // Date labels
    const labels = sliced.map(e => {
        const d = new Date(e.date);
        return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    });

    // Build one dataset per active variable
    const datasets = [];
    for (const key of activeVars) {
        const info = VARS[key];
        if (!info) continue;

        const values = sliced.map(e => extractVar(e, key));

        datasets.push({
            label: info.label,
            data: values,
            borderColor: info.color,
            backgroundColor: info.color + '18',
            tension: 0.35,
            fill: false,
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: info.color,
        });
    }

    // Create Chart.js instance
    chartInstance = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    labels: {
                        color: '#e2e8f0',
                        font: { family: 'Inter', size: 12, weight: '600' },
                        boxWidth: 14,
                        padding: 16,
                    }
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                }
            },
            scales: {
                x: {
                    ticks: { color: '#64748b', font: { size: 11 } },
                    grid:  { color: 'rgba(255,255,255,0.05)' },
                },
                y: {
                    ticks: { color: '#64748b', font: { size: 11 } },
                    grid:  { color: 'rgba(255,255,255,0.05)' },
                }
            }
        }
    });
}

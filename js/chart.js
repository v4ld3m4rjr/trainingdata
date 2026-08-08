/* ===================================================================
   chart.js — Chart.js Rendering & Variable Chips
   Fixed: period selector, error handling, canvas resize
   =================================================================== */

let chartInst = null;
let curPeriod = 7;
let activeVars = new Set(DEFAULT_ACTIVE_VARS);

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
        } else {
            chip.style.borderColor = '';
            chip.style.background = '';
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

function setPeriod(days, btn) {
    curPeriod = days;
    // Update active button styling
    var btns = document.querySelectorAll('#periodBtns .btn');
    for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
    }
    if (btn) btn.classList.add('active');
    renderChart();
}

function renderChart() {
    var canvas = document.getElementById('mainChart');
    if (!canvas) return;
    if (typeof Chart === 'undefined') return; // Chart.js not loaded yet

    // Destroy old chart safely
    if (chartInst) {
        try { chartInst.destroy(); } catch (e) { /* ignore */ }
        chartInst = null;
    }

    var all = getData();
    var sliced = all.slice(-curPeriod);
    if (!sliced.length) return;

    // Build date labels
    var labels = [];
    for (var i = 0; i < sliced.length; i++) {
        var d = new Date(sliced[i].date);
        if (isNaN(d.getTime())) {
            labels.push('—');
        } else {
            labels.push(d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
        }
    }

    // Build datasets for each active variable
    var datasets = [];
    activeVars.forEach(function (k) {
        var info = VARS[k];
        if (!info) return;
        var values = [];
        for (var j = 0; j < sliced.length; j++) {
            values.push(exVar(sliced[j], k));
        }
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
            pointBackgroundColor: info.color
        });
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
                        labels: {
                            color: '#e2e8f0',
                            font: { family: 'Inter', size: 12, weight: '600' },
                            boxWidth: 14,
                            padding: 16
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#f1f5f9',
                        bodyColor: '#94a3b8',
                        borderColor: 'rgba(255,255,255,.1)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#64748b', font: { size: 11 } },
                        grid: { color: 'rgba(255,255,255,.05)' }
                    },
                    y: {
                        ticks: { color: '#64748b', font: { size: 11 } },
                        grid: { color: 'rgba(255,255,255,.05)' }
                    }
                }
            }
        });
    } catch (err) {
        console.error('Chart render error:', err);
    }
}

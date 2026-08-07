/* ===================================================================
   data.js — Data Management & Scientific Calculations
   Handles localStorage persistence, seed data, and all derived metrics
   =================================================================== */

/**
 * Get all recorded data. Seeds demo data on first use.
 * @returns {Array} array of daily entry objects
 */
function getData() {
    let data = JSON.parse(localStorage.getItem(STORAGE_KEYS.DATA) || '[]');
    if (data.length === 0) {
        data = seedData();
        localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(data));
    }
    return data;
}

/**
 * Save data array back to localStorage.
 * @param {Array} data
 */
function saveData(data) {
    localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(data));
}

/**
 * Generate 28 days of realistic seed data for demonstration.
 * Uses scientifically-based formulas for ATL/CTL/TSB.
 * @returns {Array}
 */
function seedData() {
    const entries = [];
    let ctl = 45; // starting chronic training load

    for (let i = 28; i >= 1; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);

        // Training variables
        const pse  = rand(4, 9);            // PSE Borg CR-10
        const dur  = rand(30, 90);           // Duration in minutes
        const tss  = Math.round(pse * dur / 10);  // Session TSS
        const trimp = Math.round(dur * pse * 0.64); // Simplified TRIMP

        // Subjective recovery variables
        const sonoQ    = rand(2, 5);   // Sleep quality 1-5
        const sonoH    = rand(6, 9);   // Sleep hours
        const fadiga   = rand(1, 5);   // Fatigue (Hooper) 1-7
        const estresse = rand(1, 4);   // Stress (Hooper) 1-7
        const doms     = rand(1, 5);   // DOMS (Hooper) 1-7
        const humor    = rand(3, 7);   // Mood (Hooper) 1-7
        const tqr      = rand(10, 18); // TQR 6-20
        const prs      = rand(4, 9);   // PRS 0-10
        const dor      = rand(0, 5);   // Pain 0-10
        const motivacao = rand(5, 10); // Motivation 0-10

        // Derived metrics
        const hooper = calcHooper(fadiga, estresse, doms, humor);
        const atl = tss; // Daily ATL = today's TSS (simplified)
        ctl = Math.round(ctl + (tss - ctl) / 42); // Exponential decay CTL
        const tsb = ctl - atl;
        const mono = +(Math.random() * 1.5 + 0.5).toFixed(2);
        const prontidao  = calcProntidao(tqr, prs, sonoQ, motivacao);
        const recuperacao = calcRecuperacao(tqr, prs, sonoQ, doms);

        entries.push({
            date: d.toISOString(),
            pse, dur, tss, trimp,
            sonoQ, sonoH, fadiga, estresse, doms, humor,
            tqr, prs, dor, motivacao,
            hooper, atl, ctl, tsb, monotonia: mono,
            prontidao, recuperacao
        });
    }
    return entries;
}

// ─── SCIENTIFIC CALCULATIONS ───

/**
 * Hooper Index = Fatigue + Stress + DOMS + (8 - Mood)
 * Higher = worse overall well-being.
 */
function calcHooper(fadiga, estresse, doms, humor) {
    return fadiga + estresse + doms + (8 - humor);
}

/**
 * Readiness / Prontidão composite index (0-100).
 * Weighted: TQR 40%, PRS 30%, Sleep Quality 20%, Motivation 10%
 */
function calcProntidao(tqr, prs, sonoQ, motivacao) {
    return clamp(Math.round(
        ((tqr - 6) / 14 * 40) +
        (prs / 10 * 30) +
        (sonoQ / 5 * 20) +
        (motivacao / 10 * 10)
    ), 0, 100);
}

/**
 * Recovery index composite (0-100).
 * Weighted: TQR 35%, PRS 35%, Sleep Quality 20%, Inverse DOMS 10%
 */
function calcRecuperacao(tqr, prs, sonoQ, doms) {
    return clamp(Math.round(
        ((tqr - 6) / 14 * 35) +
        (prs / 10 * 35) +
        (sonoQ / 5 * 20) +
        ((7 - doms) / 6 * 10)
    ), 0, 100);
}

/**
 * Calculate daily monotony from last 7 TSS values.
 * Monotony = Mean(TSS) / SD(TSS)
 */
function calcMonotony(tssArray) {
    if (tssArray.length < 2) return 0;
    const mean = tssArray.reduce((a, b) => a + b, 0) / tssArray.length;
    const sd = Math.sqrt(tssArray.reduce((a, b) => a + (b - mean) ** 2, 0) / tssArray.length) || 1;
    return +(mean / sd).toFixed(2);
}

/**
 * Extract a specific variable value from an entry, with fallbacks.
 * Used by chart.js to map data entries to chart datasets.
 */
function extractVar(entry, key) {
    const n = (v) => Number(v) || 0;
    switch (key) {
        case 'TSS':         return n(entry.tss);
        case 'TRIMP':       return n(entry.trimp);
        case 'ATL':         return n(entry.atl);
        case 'CTL':         return n(entry.ctl);
        case 'TSB':         return n(entry.tsb);
        case 'Monotonia':   return n(entry.monotonia);
        case 'PSE':         return n(entry.pse);
        case 'Prontidao':   return n(entry.prontidao);
        case 'Recuperacao': return n(entry.recuperacao);
        case 'Hooper':      return n(entry.hooper);
        case 'TQR':         return n(entry.tqr);
        case 'PRS':         return n(entry.prs);
        case 'Dor':         return n(entry.dor);
        case 'SonoQ':       return n(entry.sonoQ);
        case 'Motivacao':   return n(entry.motivacao);
        default:            return 0;
    }
}

// ─── HELPERS ───

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, Math.round(v)));
}

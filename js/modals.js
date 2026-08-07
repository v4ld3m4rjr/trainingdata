/* ===================================================================
   modals.js — Modal Management & Form Saving
   Open/close modals, save questionnaire, save workout
   =================================================================== */

/**
 * Open a modal by id. Pre-fills data for profile & curriculum modals.
 * @param {string} id - modal element id
 */
function openModal(id) {
    // Pre-fill curriculum modal
    if (id === 'curriculumModal' && currentUser) {
        document.getElementById('currName').textContent    = currentUser.name;
        document.getElementById('currEmail').textContent   = currentUser.email;
        document.getElementById('currDate').textContent    = new Date(currentUser.createdAt).toLocaleDateString('pt-BR');
        document.getElementById('currRecords').textContent = getData().length;
    }

    // Pre-fill edit profile modal
    if (id === 'editProfileModal' && currentUser) {
        document.getElementById('editName').value  = currentUser.name;
        document.getElementById('editEmail').value = currentUser.email;
    }

    document.getElementById(id).classList.add('active');
}

/**
 * Close a modal by id.
 * @param {string} id - modal element id
 */
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

/**
 * Slider value helper: updates the displayed value span.
 */
function sv(slider, spanId) {
    document.getElementById(spanId).textContent = slider.value;
}

/**
 * Read an input element's integer value.
 */
function num(id) {
    return parseInt(document.getElementById(id).value) || 0;
}

// ─── SAVE RECOVERY QUESTIONNAIRE ───

/**
 * Save the daily recovery questionnaire.
 * Calculates Hooper, Prontidão, Recuperação indices.
 * Merges with today's entry if one exists, or creates a recovery-only entry.
 */
function saveQuestionnaire() {
    const sonoQ    = num('sonoQ');
    const sonoH    = parseFloat(document.getElementById('sonoH').value) || 7;
    const fadiga   = num('fadiga');
    const estresse = num('estresse');
    const doms     = num('doms');
    const humor    = num('humor');
    const tqr      = num('tqr');
    const prs      = num('prs');
    const dor      = num('dor');
    const motivacao = num('motivacao');

    // Derived indices
    const hooper     = calcHooper(fadiga, estresse, doms, humor);
    const prontidao  = calcProntidao(tqr, prs, sonoQ, motivacao);
    const recuperacao = calcRecuperacao(tqr, prs, sonoQ, doms);

    const data = getData();
    const prev = data.length ? data[data.length - 1] : null;

    // Check if there's already an entry for today (merge workout + recovery)
    const today = new Date().toISOString().slice(0, 10);
    const todayEntry = data.find(e => e.date && e.date.slice(0, 10) === today);

    if (todayEntry) {
        // Merge recovery data into existing today's entry
        Object.assign(todayEntry, {
            sonoQ, sonoH, fadiga, estresse, doms, humor,
            tqr, prs, dor, motivacao,
            hooper, prontidao, recuperacao
        });
    } else {
        // Create a recovery-only entry (no new training load)
        const atl  = prev ? Math.round(prev.atl * 0.87) : 0;  // ATL decay
        const ctl  = prev ? Math.round(prev.ctl + (0 - prev.ctl) / 42) : 0;
        const tsb  = ctl - atl;
        const mono = prev ? prev.monotonia : 0;

        data.push({
            date: new Date().toISOString(),
            pse: 0, dur: 0, tss: 0, trimp: 0,
            sonoQ, sonoH, fadiga, estresse, doms, humor,
            tqr, prs, dor, motivacao,
            hooper, atl, ctl, tsb, monotonia: mono,
            prontidao, recuperacao
        });
    }

    saveData(data);
    closeModal('questionnaireModal');
    refreshAll();
    alert('Questionário de recuperação salvo!');
}

// ─── SAVE WORKOUT ───

/**
 * Save a workout session.
 * Calculates TSS, TRIMP, ATL, CTL, TSB, Monotony.
 * Merges with today's entry if one exists, or creates a new entry.
 */
function saveWorkout() {
    const type  = document.getElementById('wkType').value;
    const dur   = num('wkDur');
    const pse   = num('wkPse');
    const notes = document.getElementById('wkNotes').value;

    // Training load calculations
    const tss   = Math.round(pse * dur / 10);
    const trimp = Math.round(dur * pse * 0.64);

    const data = getData();
    const prev = data.length ? data[data.length - 1] : null;

    // ATL/CTL/TSB
    const atl     = tss;
    const prevCtl = prev ? (prev.ctl || 45) : 45;
    const ctl     = Math.round(prevCtl + (tss - prevCtl) / 42);
    const tsb     = ctl - atl;

    // Monotony from last 7 TSS values
    const last7 = data.slice(-6).map(e => e.tss || 0).concat([tss]);
    const mono  = calcMonotony(last7);

    // Carry forward last recovery data or use defaults
    const defaults = {
        sonoQ: 3, sonoH: 7, fadiga: 3, estresse: 3,
        doms: 3, humor: 5, tqr: 13, prs: 5,
        dor: 2, motivacao: 7, prontidao: 60, recuperacao: 60
    };

    const carry = {};
    for (const [k, v] of Object.entries(defaults)) {
        carry[k] = prev ? (prev[k] ?? v) : v;
    }

    const hooper = calcHooper(carry.fadiga, carry.estresse, carry.doms, carry.humor);

    // Merge or create entry
    const today = new Date().toISOString().slice(0, 10);
    const todayEntry = data.find(e => e.date && e.date.slice(0, 10) === today);

    if (todayEntry) {
        Object.assign(todayEntry, {
            pse, dur, tss, trimp, atl, ctl, tsb,
            monotonia: mono, workoutType: type, notes
        });
    } else {
        data.push({
            date: new Date().toISOString(),
            pse, dur, tss, trimp,
            ...carry, hooper,
            atl, ctl, tsb, monotonia: mono,
            workoutType: type, notes
        });
    }

    saveData(data);
    closeModal('workoutModal');
    refreshAll();
    alert('Treino de ' + type + ' registrado!');
}

// ─── CLOSE ON BACKDROP CLICK ───
window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

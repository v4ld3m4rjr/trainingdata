/* ===================================================================
   modals.js — Modal Management, Questionnaire (0-10 & TQR 0-13),
   Dynamic Scale Descriptors & Detailed Legend Modal
   =================================================================== */

function openModal(id) {
    if (id === 'curriculumModal' && currentUser) {
        document.getElementById('currName').textContent = currentUser.name;
        document.getElementById('currEmail').textContent = currentUser.email;
        document.getElementById('currDate').textContent = new Date(currentUser.createdAt).toLocaleDateString('pt-BR');
        document.getElementById('currRecords').textContent = getData().length;
    }
    if (id === 'editProfileModal' && currentUser) {
        document.getElementById('editName').value = currentUser.name;
        document.getElementById('editEmail').value = currentUser.email;
    }
    if (id === 'questionnaireModal') {
        const data = getData();
        const today = new Date().toISOString().slice(0, 10);
        const te = data.find(function (e) { return e.date && e.date.slice(0, 10) === today; });
        const qHrvEl = document.getElementById('qHrv');
        if (qHrvEl) {
            qHrvEl.value = (te && te.hrv) ? te.hrv : '';
        }

        // Initialize / sync all slider descriptors
        const sliders = [
            { id: 'sonoQ', valId: 'vSonoQ', key: 'sonoQ' },
            { id: 'sonoH', valId: 'vSonoH', key: null },
            { id: 'fadiga', valId: 'vFadiga', key: 'fadiga' },
            { id: 'estresse', valId: 'vEstresse', key: 'estresse' },
            { id: 'doms', valId: 'vDoms', key: 'doms' },
            { id: 'humor', valId: 'vHumor', key: 'humor' },
            { id: 'tqr', valId: 'vTqr', key: 'tqr' },
            { id: 'prs', valId: 'vPrs', key: 'prs' },
            { id: 'dor', valId: 'vDor', key: 'dor' },
            { id: 'motivacao', valId: 'vMotivacao', key: 'motivacao' }
        ];

        sliders.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) {
                if (te && te[s.id] != null) el.value = te[s.id];
                sv(el, s.valId, s.key);
            }
        });
    }
    if (id === 'workoutModal') {
        document.getElementById('wkDate').value = new Date().toISOString().slice(0, 10);
        const wkPseEl = document.getElementById('wkPse');
        if (wkPseEl) sv(wkPseEl, 'vWkPse', 'wkPse');
    }
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

/**
 * Update Slider Value & Live Scale Descriptor
 */
function sv(slider, valId, scaleKey) {
    const valEl = document.getElementById(valId);
    if (!valEl) return;

    const val = parseFloat(slider.value);

    if (scaleKey && typeof SCALE_LEGENDS !== 'undefined' && SCALE_LEGENDS[scaleKey]) {
        const info = SCALE_LEGENDS[scaleKey];
        const desc = info.descriptions[val] || '';

        // Display value
        valEl.textContent = val;

        // Update live descriptor hint below slider
        const descEl = document.getElementById('desc_' + scaleKey);
        if (descEl) {
            descEl.innerHTML = `<strong>${val}:</strong> ${desc}`;
        }
    } else {
        valEl.textContent = slider.value + (valId === 'vSonoH' ? 'h' : valId === 'vWkDur' ? 'm' : '');
    }
}

/**
 * Show Detailed Scale Legend in Modal
 */
function showScaleLegend(scaleKey) {
    if (typeof SCALE_LEGENDS === 'undefined' || !SCALE_LEGENDS[scaleKey]) return;
    const info = SCALE_LEGENDS[scaleKey];

    const titleEl = document.getElementById('scaleLegendTitle');
    const contentEl = document.getElementById('scaleLegendContent');
    const sliderEl = document.getElementById(scaleKey);
    const currentVal = sliderEl ? parseFloat(sliderEl.value) : -1;

    if (titleEl) titleEl.textContent = `📋 Legenda: ${info.title}`;

    if (contentEl) {
        let html = '<div class="scale-legend-list">';
        for (let i = info.min; i <= info.max; i++) {
            const isSelected = (i === currentVal);
            const desc = info.descriptions[i] || '';
            html += `
                <div class="scale-legend-row ${isSelected ? 'selected' : ''}" onclick="selectScaleValue('${scaleKey}', ${i})">
                    <div class="scale-num-badge">${i}</div>
                    <div class="scale-desc-text">${desc}</div>
                    ${isSelected ? '<span class="scale-selected-check">✓ Selecionado</span>' : ''}
                </div>
            `;
        }
        html += '</div>';
        contentEl.innerHTML = html;
    }

    openModal('scaleLegendModal');
}

/**
 * Quick select value from legend modal
 */
function selectScaleValue(scaleKey, val) {
    const sliderEl = document.getElementById(scaleKey);
    if (sliderEl) {
        sliderEl.value = val;
        const valMap = {
            sonoQ: 'vSonoQ', fadiga: 'vFadiga', estresse: 'vEstresse',
            doms: 'vDoms', humor: 'vHumor', tqr: 'vTqr',
            prs: 'vPrs', dor: 'vDor', motivacao: 'vMotivacao', wkPse: 'vWkPse'
        };
        sv(sliderEl, valMap[scaleKey], scaleKey);
    }
    closeModal('scaleLegendModal');
}

function num(id) { return parseFloat(document.getElementById(id).value) || 0; }

/* ── Save Recovery Questionnaire (0-10 Scales, TQR 0-13) ── */
function saveQuestionnaire() {
    var sonoQ = num('sonoQ'), sonoH = parseFloat(document.getElementById('sonoH').value) || 7;
    var fadiga = num('fadiga'), estresse = num('estresse'), doms = num('doms'), humor = num('humor');
    var tqr = num('tqr'), prs = num('prs'), dor = num('dor'), motivacao = num('motivacao');
    var qHrv = num('qHrv');

    var hooper = cHooper(fadiga, estresse, doms, humor);
    var prontidao = cPront(tqr, prs, sonoQ, motivacao);
    var recuperacao = cRecup(tqr, prs, sonoQ, doms);

    var data = getData();
    var prev = data.length ? data[data.length - 1] : null;
    var today = new Date().toISOString().slice(0, 10);
    var te = data.find(function (e) { return e.date && e.date.slice(0, 10) === today; });

    if (te) {
        var updatedFields = {
            sonoQ: sonoQ, sonoH: sonoH, fadiga: fadiga, estresse: estresse,
            doms: doms, humor: humor, tqr: tqr, prs: prs, dor: dor,
            motivacao: motivacao, hooper: hooper, prontidao: prontidao, recuperacao: recuperacao
        };
        if (qHrv > 0) updatedFields.hrv = qHrv;
        Object.assign(te, updatedFields);
        if (typeof pushEntryToSupabase === 'function') pushEntryToSupabase(te);
    } else {
        var atl = prev ? Math.round(prev.atl * 0.87) : 0;
        var ctl = prev ? Math.round(prev.ctl + (0 - prev.ctl) / 42) : 0;
        var newEntry = {
            date: new Date().toISOString(), pse: 0, dur: 0, tss: 0, trimp: 0,
            hrv: qHrv > 0 ? qHrv : (prev ? prev.hrv : 0), fcmedia: 0, rhr: prev ? prev.rhr : 42,
            sonoQ: sonoQ, sonoH: sonoH, fadiga: fadiga, estresse: estresse, doms: doms, humor: humor,
            tqr: tqr, prs: prs, dor: dor, motivacao: motivacao,
            hooper: hooper, atl: atl, ctl: ctl, tsb: ctl - atl,
            monotonia: prev ? prev.monotonia : 0, prontidao: prontidao, recuperacao: recuperacao
        };
        data.push(newEntry);
        if (typeof pushEntryToSupabase === 'function') pushEntryToSupabase(newEntry);
    }
    saveData(data); closeModal('questionnaireModal'); refreshAll();
    alert('Questionário de recuperação salvo com sucesso!');
}

/* ── Save Workout ── */
function saveWorkout() {
    var selectedDate = document.getElementById('wkDate').value;
    var type = document.getElementById('wkType').value;
    var dur = num('wkDur');
    var pse = num('wkPse');
    var hrv = num('wkHrv');
    var fcmedia = num('wkFc');
    var notes = document.getElementById('wkNotes').value;

    var tss = Math.round(pse * dur / 10);
    var trimp = Math.round(dur * pse * 0.64);

    var data = getData();
    var prev = data.length ? data[data.length - 1] : null;
    var atl = tss;
    var prevCtl = prev ? (prev.ctl || 45) : 45;
    var ctl = Math.round(prevCtl + (tss - prevCtl) / 42);
    var tsb = ctl - atl;
    var last7 = data.slice(-6).map(function (e) { return e.tss || 0; }).concat([tss]);
    var mono = cMono(last7);

    var defs = { sonoQ: 7, sonoH: 7.5, fadiga: 3, estresse: 3, doms: 3, humor: 7, tqr: 9, prs: 6, dor: 2, motivacao: 8, prontidao: 65, recuperacao: 65 };
    var c = {};
    for (var k in defs) { c[k] = prev ? (prev[k] != null ? prev[k] : defs[k]) : defs[k]; }
    var hooper = cHooper(c.fadiga, c.estresse, c.doms, c.humor);

    var entryDate = selectedDate || new Date().toISOString().slice(0, 10);
    var te = data.find(function (e) { return e.date && e.date.slice(0, 10) === entryDate; });

    if (te) {
        Object.assign(te, { pse: pse, dur: dur, tss: tss, trimp: trimp, hrv: hrv || te.hrv, fcmedia: fcmedia, atl: atl, ctl: ctl, tsb: tsb, monotonia: mono, workoutType: type, notes: notes });
        if (typeof pushEntryToSupabase === 'function') pushEntryToSupabase(te);
    } else {
        var fullDate = new Date(entryDate + 'T12:00:00').toISOString();
        var newWkEntry = {
            date: fullDate, pse: pse, dur: dur, tss: tss, trimp: trimp, hrv: hrv, fcmedia: fcmedia, rhr: prev ? prev.rhr : 42,
            sonoQ: c.sonoQ, sonoH: c.sonoH, fadiga: c.fadiga, estresse: c.estresse,
            doms: c.doms, humor: c.humor, tqr: c.tqr, prs: c.prs, dor: c.dor, motivacao: c.motivacao,
            hooper: hooper, atl: atl, ctl: ctl, tsb: tsb, monotonia: mono,
            prontidao: c.prontidao, recuperacao: c.recuperacao, workoutType: type, notes: notes
        };
        data.push(newWkEntry);
        data.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
        if (typeof pushEntryToSupabase === 'function') pushEntryToSupabase(newWkEntry);
    }
    saveData(data); closeModal('workoutModal'); refreshAll();
    alert('Treino de ' + type + ' registrado em ' + entryDate + '!');
}

/* ── Close on backdrop click ── */
window.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

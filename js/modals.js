/* ===================================================================
   modals.js — Modal Management, Questionnaire & Workout Save
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
    if (id === 'workoutModal') {
        // Default date to today
        document.getElementById('wkDate').value = new Date().toISOString().slice(0, 10);
    }
    document.getElementById(id).classList.add('active');
}

function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function sv(s, id) { document.getElementById(id).textContent = s.value; }
function num(id) { return parseInt(document.getElementById(id).value) || 0; }

/* ── Save Recovery Questionnaire ── */
function saveQuestionnaire() {
    var sonoQ = num('sonoQ'), sonoH = parseFloat(document.getElementById('sonoH').value) || 7;
    var fadiga = num('fadiga'), estresse = num('estresse'), doms = num('doms'), humor = num('humor');
    var tqr = num('tqr'), prs = num('prs'), dor = num('dor'), motivacao = num('motivacao');

    var hooper = cHooper(fadiga, estresse, doms, humor);
    var prontidao = cPront(tqr, prs, sonoQ, motivacao);
    var recuperacao = cRecup(tqr, prs, sonoQ, doms);

    var data = getData();
    var prev = data.length ? data[data.length - 1] : null;
    var today = new Date().toISOString().slice(0, 10);
    var te = data.find(function (e) { return e.date && e.date.slice(0, 10) === today; });

    if (te) {
        Object.assign(te, { sonoQ: sonoQ, sonoH: sonoH, fadiga: fadiga, estresse: estresse, doms: doms, humor: humor, tqr: tqr, prs: prs, dor: dor, motivacao: motivacao, hooper: hooper, prontidao: prontidao, recuperacao: recuperacao });
    } else {
        var atl = prev ? Math.round(prev.atl * 0.87) : 0;
        var ctl = prev ? Math.round(prev.ctl + (0 - prev.ctl) / 42) : 0;
        data.push({
            date: new Date().toISOString(), pse: 0, dur: 0, tss: 0, trimp: 0, hrv: 0, fcmedia: 0,
            sonoQ: sonoQ, sonoH: sonoH, fadiga: fadiga, estresse: estresse, doms: doms, humor: humor,
            tqr: tqr, prs: prs, dor: dor, motivacao: motivacao,
            hooper: hooper, atl: atl, ctl: ctl, tsb: ctl - atl,
            monotonia: prev ? prev.monotonia : 0, prontidao: prontidao, recuperacao: recuperacao
        });
    }
    saveData(data); closeModal('questionnaireModal'); refreshAll();
    alert('Questionário de recuperação salvo!');
}

/* ── Save Workout ── */
function saveWorkout() {
    var selectedDate = document.getElementById('wkDate').value; // YYYY-MM-DD from calendar
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

    var defs = { sonoQ: 3, sonoH: 7, fadiga: 3, estresse: 3, doms: 3, humor: 5, tqr: 13, prs: 5, dor: 2, motivacao: 7, prontidao: 60, recuperacao: 60 };
    var c = {};
    for (var k in defs) { c[k] = prev ? (prev[k] != null ? prev[k] : defs[k]) : defs[k]; }
    var hooper = cHooper(c.fadiga, c.estresse, c.doms, c.humor);

    // Use the selected date from calendar
    var entryDate = selectedDate || new Date().toISOString().slice(0, 10);
    var te = data.find(function (e) { return e.date && e.date.slice(0, 10) === entryDate; });

    if (te) {
        Object.assign(te, { pse: pse, dur: dur, tss: tss, trimp: trimp, hrv: hrv, fcmedia: fcmedia, atl: atl, ctl: ctl, tsb: tsb, monotonia: mono, workoutType: type, notes: notes });
    } else {
        var fullDate = new Date(entryDate + 'T12:00:00').toISOString();
        data.push({
            date: fullDate, pse: pse, dur: dur, tss: tss, trimp: trimp, hrv: hrv, fcmedia: fcmedia,
            sonoQ: c.sonoQ, sonoH: c.sonoH, fadiga: c.fadiga, estresse: c.estresse,
            doms: c.doms, humor: c.humor, tqr: c.tqr, prs: c.prs, dor: c.dor, motivacao: c.motivacao,
            hooper: hooper, atl: atl, ctl: ctl, tsb: tsb, monotonia: mono,
            prontidao: c.prontidao, recuperacao: c.recuperacao, workoutType: type, notes: notes
        });
        // Sort by date after adding past entries
        data.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
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

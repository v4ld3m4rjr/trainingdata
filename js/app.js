/* ===================================================================
   app.js — Athlytic iOS Application Init & Tab Router
   =================================================================== */

function switchMainTab(tab) {
    const viewToday = document.getElementById('viewToday');
    const viewTrends = document.getElementById('viewTrends');
    const tabNavToday = document.getElementById('tabNavToday');
    const tabNavTrends = document.getElementById('tabNavTrends');

    if (tab === 'today') {
        if (viewToday) viewToday.style.display = 'block';
        if (viewTrends) viewTrends.style.display = 'none';
        if (tabNavToday) tabNavToday.classList.add('active');
        if (tabNavTrends) tabNavTrends.classList.remove('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'trends') {
        if (viewToday) viewToday.style.display = 'none';
        if (viewTrends) viewTrends.style.display = 'block';
        if (tabNavToday) tabNavToday.classList.remove('active');
        if (tabNavTrends) tabNavTrends.classList.add('active');
        renderChart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function showDashboard() {
    const authScreen = document.getElementById('authScreen');
    const mainScreen = document.getElementById('mainScreen');
    if (authScreen) authScreen.classList.remove('active');
    if (mainScreen) mainScreen.classList.add('active');

    const now = new Date();
    const dEl = document.getElementById('headerDate');
    if (dEl) {
        const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
        const capDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
        const uName = (currentUser && currentUser.name) ? currentUser.name.split(' ')[0] : 'Atleta';
        dEl.textContent = `${capDate} · ${uName}`;
    }

    buildVarChips();
    refreshAll();
}

function refreshAll() {
    const data = getData();
    updateIndices(data);
    runAIAnalysis();
    renderChart();
}

document.addEventListener('DOMContentLoaded', () => {
    const s = localStorage.getItem(SK.USER);
    if (s) {
        try {
            currentUser = JSON.parse(s);
            showDashboard();
        } catch (e) {
            console.error(e);
        }
    }
});

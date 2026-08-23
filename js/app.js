/* ===================================================================
   app.js — Application Init & Glue
   =================================================================== */

function showDashboard(){
    document.getElementById('authScreen').classList.remove('active');
    document.getElementById('mainScreen').classList.add('active');
    const uEl = document.getElementById('userName');
    if (uEl && currentUser && currentUser.name) uEl.textContent = currentUser.name.split(' ')[0];
    const now = new Date();
    const dEl = document.getElementById('headerDate');
    if (dEl) dEl.textContent = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    buildVarChips();
    refreshAll();
}

function refreshAll(){
    const data=getData();
    updateIndices(data);
    runAIAnalysis();
    renderChart();
}

document.addEventListener('DOMContentLoaded',()=>{
    const s=localStorage.getItem(SK.USER);
    if(s){currentUser=JSON.parse(s);showDashboard();}
});

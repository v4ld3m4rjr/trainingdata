/* ===================================================================
   app.js — Application Init & Glue
   =================================================================== */

function showDashboard(){
    document.getElementById('authScreen').classList.remove('active');
    document.getElementById('mainScreen').classList.add('active');
    document.getElementById('userName').textContent=currentUser.name.split(' ')[0];
    const now=new Date();
    document.getElementById('headerDate').textContent=now.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
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

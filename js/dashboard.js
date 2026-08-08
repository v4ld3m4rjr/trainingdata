/* ===================================================================
   dashboard.js — Index Cards & AI Analysis
   =================================================================== */

function updateIndices(data) {
    if (!data||!data.length) return;
    const L = data[data.length-1];
    const rec = CL(L.recuperacao||0,0,100);
    const pront = CL(L.prontidao||0,0,100);
    const intens = CL(Math.round(pront*.85+10),0,100);

    setIdx('idxRecovery', rec,   rec>=70?'var(--success)':rec>=40?'var(--warning)':'var(--danger)');
    setIdx('idxReadiness',pront, pront>=70?'var(--success)':pront>=40?'var(--warning)':'var(--danger)');
    setIdx('idxIntensity',intens+'%','var(--warning)');
}

function setIdx(id,val,color){const e=document.getElementById(id);if(e){e.textContent=val;e.style.color=color;}}

function runAIAnalysis(){
    const data=getData(), el=document.getElementById('aiText');
    if(!el)return;
    if(!data.length){el.innerHTML='Sem dados. Preencha o questionário de recuperação.';return;}

    const L=data[data.length-1];
    const rec=CL(L.recuperacao||0,0,100), pront=CL(L.prontidao||0,0,100), tsb=L.tsb||0;

    let h='<strong>Análise do Dia:</strong><br><br>';

    if(rec>=70&&pront>=70)
        h+='✅ <strong>Condição Ótima!</strong> Recuperação e prontidão altas. Pode treinar com alta intensidade e buscar recordes pessoais.';
    else if(rec>=50&&pront>=50)
        h+='⚠️ <strong>Condição Regular.</strong> Mantenha o treino planejado mas fique atento a sinais de fadiga. Priorize hidratação e nutrição.';
    else
        h+='🔴 <strong>Atenção!</strong> Recuperação ou prontidão abaixo do ideal. Considere treino regenerativo ou descanso ativo.';

    if(tsb<-15) h+='<br><br>📉 <strong>TSB muito negativo ('+tsb+'):</strong> Acúmulo de carga alto. Risco de overreaching — reduza intensidade.';
    if(tsb>10)  h+='<br><br>📈 <strong>TSB positivo ('+tsb+'):</strong> Forma fresca. Boa fase para testes ou competição.';
    if((L.dor||0)>=7) h+='<br><br>🚨 <strong>Dor elevada detectada.</strong> Avalie possibilidade de lesão e consulte um profissional.';
    if((L.sonoQ||3)<=2) h+='<br><br>😴 <strong>Sono insuficiente.</strong> Priorize 7-9h de sono de qualidade.';
    if((L.hooper||0)>=20) h+='<br><br>⛔ <strong>Hooper Index alto ('+L.hooper+'):</strong> Estresse/fadiga acumulados. Considere dia de descanso.';
    if((L.monotonia||0)>=2.0) h+='<br><br>🔁 <strong>Monotonia alta ('+L.monotonia+'):</strong> Varie estímulos para evitar overtraining.';

    el.innerHTML=h;
}

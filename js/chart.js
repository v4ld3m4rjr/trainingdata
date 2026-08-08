/* ===================================================================
   chart.js — Chart.js Rendering & Variable Chips
   =================================================================== */

let chartInst = null, curPeriod = 7;
let activeVars = new Set(DEFAULT_ACTIVE_VARS);

function buildVarChips(){
    const c=document.getElementById('varChips');if(!c)return;c.innerHTML='';
    for(const[k,info]of Object.entries(VARS)){
        const chip=document.createElement('div');
        const on=activeVars.has(k);
        chip.className='var-chip'+(on?' active':'');
        chip.textContent=info.label;
        chip.style.borderColor=on?info.color:'';
        chip.style.background=on?info.color:'';
        chip.onclick=()=>{if(activeVars.has(k))activeVars.delete(k);else activeVars.add(k);buildVarChips();renderChart();};
        c.appendChild(chip);
    }
}

function setPeriod(days,btn){
    curPeriod=days;
    document.querySelectorAll('#periodBtns .btn').forEach(b=>b.classList.remove('active'));
    if(btn)btn.classList.add('active');
    renderChart();
}

function renderChart(){
    const canvas=document.getElementById('mainChart');if(!canvas)return;
    if(chartInst){chartInst.destroy();chartInst=null;}

    const all=getData(), sliced=all.slice(-curPeriod);
    if(!sliced.length)return;

    const labels=sliced.map(e=>{
        const d=new Date(e.date);
        return isNaN(d)?'—':d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'});
    });

    const datasets=[];
    for(const k of activeVars){
        const info=VARS[k];if(!info)continue;
        datasets.push({
            label:info.label,
            data:sliced.map(e=>exVar(e,k)),
            borderColor:info.color,
            backgroundColor:info.color+'18',
            tension:.35,fill:false,borderWidth:3,
            pointRadius:4,pointHoverRadius:7,pointBackgroundColor:info.color,
        });
    }

    chartInst=new Chart(canvas.getContext('2d'),{
        type:'line',data:{labels,datasets},
        options:{
            responsive:true,maintainAspectRatio:false,
            interaction:{mode:'index',intersect:false},
            plugins:{
                legend:{labels:{color:'#e2e8f0',font:{family:'Inter',size:12,weight:'600'},boxWidth:14,padding:16}},
                tooltip:{backgroundColor:'#1e293b',titleColor:'#f1f5f9',bodyColor:'#94a3b8',borderColor:'rgba(255,255,255,.1)',borderWidth:1,cornerRadius:8,padding:12}
            },
            scales:{
                x:{ticks:{color:'#64748b',font:{size:11}},grid:{color:'rgba(255,255,255,.05)'}},
                y:{ticks:{color:'#64748b',font:{size:11}},grid:{color:'rgba(255,255,255,.05)'}}
            }
        }
    });
}

/* ===================================================================
   modals.js — Modal Management, Questionnaire & Workout Save
   =================================================================== */

function openModal(id){
    if(id==='curriculumModal'&&currentUser){
        document.getElementById('currName').textContent=currentUser.name;
        document.getElementById('currEmail').textContent=currentUser.email;
        document.getElementById('currDate').textContent=new Date(currentUser.createdAt).toLocaleDateString('pt-BR');
        document.getElementById('currRecords').textContent=getData().length;
    }
    if(id==='editProfileModal'&&currentUser){
        document.getElementById('editName').value=currentUser.name;
        document.getElementById('editEmail').value=currentUser.email;
    }
    document.getElementById(id).classList.add('active');
}

function closeModal(id){document.getElementById(id).classList.remove('active');}
function sv(s,id){document.getElementById(id).textContent=s.value;}
function num(id){return parseInt(document.getElementById(id).value)||0;}

/* ── Save Recovery Questionnaire ── */
function saveQuestionnaire(){
    const sonoQ=num('sonoQ'),sonoH=parseFloat(document.getElementById('sonoH').value)||7;
    const fadiga=num('fadiga'),estresse=num('estresse'),doms=num('doms'),humor=num('humor');
    const tqr=num('tqr'),prs=num('prs'),dor=num('dor'),motivacao=num('motivacao');

    const hooper=cHooper(fadiga,estresse,doms,humor);
    const prontidao=cPront(tqr,prs,sonoQ,motivacao);
    const recuperacao=cRecup(tqr,prs,sonoQ,doms);

    const data=getData(), prev=data.length?data[data.length-1]:null;
    const today=new Date().toISOString().slice(0,10);
    const te=data.find(e=>e.date&&e.date.slice(0,10)===today);

    if(te){
        Object.assign(te,{sonoQ,sonoH,fadiga,estresse,doms,humor,tqr,prs,dor,motivacao,hooper,prontidao,recuperacao});
    } else {
        const atl=prev?Math.round(prev.atl*.87):0;
        const ctl=prev?Math.round(prev.ctl+(0-prev.ctl)/42):0;
        data.push({
            date:new Date().toISOString(), pse:0,dur:0,tss:0,trimp:0,
            sonoQ,sonoH,fadiga,estresse,doms,humor,tqr,prs,dor,motivacao,
            hooper, atl,ctl, tsb:ctl-atl, monotonia:prev?prev.monotonia:0,
            prontidao,recuperacao
        });
    }
    saveData(data);closeModal('questionnaireModal');refreshAll();
    alert('Questionário de recuperação salvo!');
}

/* ── Save Workout ── */
function saveWorkout(){
    const type=document.getElementById('wkType').value;
    const dur=num('wkDur'),pse=num('wkPse'),notes=document.getElementById('wkNotes').value;
    const tss=Math.round(pse*dur/10), trimp=Math.round(dur*pse*.64);

    const data=getData(), prev=data.length?data[data.length-1]:null;
    const atl=tss, prevCtl=prev?(prev.ctl||45):45;
    const ctl=Math.round(prevCtl+(tss-prevCtl)/42), tsb=ctl-atl;
    const last7=data.slice(-6).map(e=>e.tss||0).concat([tss]);
    const mono=cMono(last7);

    const defs={sonoQ:3,sonoH:7,fadiga:3,estresse:3,doms:3,humor:5,tqr:13,prs:5,dor:2,motivacao:7,prontidao:60,recuperacao:60};
    const c={};for(const[k,v]of Object.entries(defs))c[k]=prev?(prev[k]??v):v;
    const hooper=cHooper(c.fadiga,c.estresse,c.doms,c.humor);

    const today=new Date().toISOString().slice(0,10);
    const te=data.find(e=>e.date&&e.date.slice(0,10)===today);
    if(te){
        Object.assign(te,{pse,dur,tss,trimp,atl,ctl,tsb,monotonia:mono,workoutType:type,notes});
    } else {
        data.push({date:new Date().toISOString(),pse,dur,tss,trimp,...c,hooper,atl,ctl,tsb,monotonia:mono,workoutType:type,notes});
    }
    saveData(data);closeModal('workoutModal');refreshAll();
    alert('Treino de '+type+' registrado!');
}

/* ── Close on backdrop click ── */
window.addEventListener('click',e=>{if(e.target.classList.contains('modal'))e.target.classList.remove('active');});

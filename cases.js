'use strict';
const $ = s => document.querySelector(s);
const BOARD = 'https://casmi26-chemistry-desk.jinseobae.chatgpt.site/discussion';
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = id => 'cases.html?case=' + encodeURIComponent(id) + '#case-detail';
const boardLink = (id, section) => BOARD + '?case=' + encodeURIComponent(id) + '#' + section;
let cases = [], current = null;
function renderLibrary() {
  const query = $('#caseSearch').value.toLowerCase().trim(), group = $('#groupFilter').value;
  const shown = cases.filter(c => (group === 'all' || c.group === group) && [c.id,c.good.formula,c.alt.formula,...c.spectra.map(s=>s.id)].join(' ').toLowerCase().includes(query));
  $('#resultCount').textContent = shown.length + ' of ' + cases.length + ' cases shown';
  $('#noCases').hidden = shown.length > 0;
  $('#caseGrid').innerHTML = shown.map(c => `<article class="case-card ${c.group}"><div class="card-meta"><span class="group-tag">${c.group==='loss'?'Lost rank 1':'Gained rank 1'}</span><span>v3 #${c.before} → v4 #${c.after}</span></div><h3><a href="${link(c.id)}">${c.id}</a></h3><p class="card-formula">${esc(c.good.formula)} · ${c.spectra.length} ${c.spectra.length===1?'spectrum':'spectra'}</p><div class="card-drawings"><div><img src="${esc(c.good.image)}" alt="Reference structure A for ${c.id}" loading="lazy" width="200" height="130"><span>A · Reference</span></div><div><img src="${esc(c.alt.image)}" alt="Alternative structure B for ${c.id}" loading="lazy" width="200" height="130"><span>B · Alternative</span></div></div>${c.id==='confirm0003'?'<p class="example-tag">Includes a worked chemistry example</p>':''}<div class="card-bottom"><a href="${link(c.id)}" aria-label="Open case ${c.id}">Open case →</a><a href="${boardLink(c.id,'questions')}" aria-label="Discussion for ${c.id}">Discussion ↗</a></div></article>`).join('');
}
function renderCase(c) {
  current = c;
  $('#library').hidden = true;
  $('.hero').hidden = true;
  $('#case-detail').hidden = false;
  document.title = c.id + ' · Chemistry review · CASMI26';
  $('#caseTitle').textContent = c.id;
  $('#caseJump').value = c.id;
  $('#groupLabel').textContent = c.group === 'loss' ? 'PRIORITY REVIEW / LOST RANK 1' : 'COMPARISON CASE / GAINED RANK 1';
  $('#caseSummary').textContent = c.good.formula + ' · ' + c.spectra.length + ' measured ' + (c.spectra.length === 1 ? 'spectrum' : 'spectra');
  $('#rankChange').textContent = '#' + c.before + ' → #' + c.after;
  $('#formulaSummary').textContent = c.same_formula ? 'A and B have the same molecular formula. Compare where the atoms are connected, the rings, and the functional groups.' : 'A and B have different molecular formulas. Check the elemental composition and precursor assignment before interpreting fragments.';
  $('#structurePair').innerHTML = [['A · Recorded reference',c.good],['B · Alternative structure',c.alt]].map(([name,m]) => `<article class="structure-card"><h4>${name}</h4><img src="${esc(m.image)}" alt="${name} for ${c.id}" width="500" height="330"><dl><dt>Molecular formula</dt><dd>${esc(m.formula)}</dd><dt>Neutral exact mass</dt><dd>${m.mass.toFixed(5)} Da</dd><dt>RDKit ring count</dt><dd>${m.rings}</dd></dl><details><summary>View structure notation (SMILES)</summary><code>${esc(m.smiles)}</code></details></article>`).join('');
  $('#spectrumSelect').replaceChildren(...c.spectra.map((s,i)=>new Option(s.id + ' · ' + s.ce.join(' / ') + ' eV',String(i))));
  renderSpectrum(0);
  const first = c.spectra[0], peakIndex = first.intensity.indexOf(Math.max(...first.intensity));
  const questions = [
    `Compare A and B: which functional groups, substitution positions, ring connections, or likely protonation sites could lead to different fragmentation? The saved ring counts are ${c.good.rings} for A and ${c.alt.rings} for B. Ring count alone does not distinguish a pathway.`,
    `In ${first.id} (${first.ce.join(' / ')} eV), the strongest peak is m/z ${first.mz[peakIndex].toFixed(3)}. What ion could explain it? Propose a cleavage or rearrangement for A, then ask whether B could form the same ion. Which other peaks would support or contradict that explanation?`,
    c.spectra.length > 1 ? `There are ${c.spectra.length} measured spectra for this case. Compare the displayed acquisition conditions and the fragments that appear or change intensity. Are the changes consistent with your proposed pathway? Keep each measurement separate when interpreting neutral losses.` : 'Only one measured spectrum is included for this case. Which assignments remain uncertain without an energy series or additional fragmentation data? Do mass differences support a specific neutral loss, or several possible explanations?',
    'What additional measurement would best distinguish A from B—for example, a collision-energy series, MS3 where available, or an authentic-standard comparison? State the expected result and a plausible alternative explanation.'
  ];
  $('#reviewQuestions').replaceChildren(...questions.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  $('#reviewScope').textContent = c.id === 'confirm0003' ? 'A worked hypothesis is available for this case. Review its assumptions and alternative pathways before treating any assignment as established.' : 'This case has measured data and structure drawings, but no completed chemical interpretation yet. Start with any one question below.';
  $('#workedExampleLink').hidden = c.id !== 'confirm0003';
  $('#askCase').href = boardLink(c.id,'write');
  $('#readCase').href = $('#caseDiscussion').href = boardLink(c.id,'questions');
  $('#notesCase').href = 'guide.html?case=' + encodeURIComponent(c.id) + '#casePanel';
  const index = cases.indexOf(c);
  for (const [selector,offset] of [['#previousCase',-1],['#nextCase',1]]) {
    const a=$(selector), adjacent=cases[index+offset];a.setAttribute('aria-disabled',String(!adjacent));
    if(adjacent) a.href=link(adjacent.id); else a.removeAttribute('href');
  }
}
function renderSpectrum(index) {
  const s = current.spectra[index];
  const meta = [s.adduct + ' · ' + s.mode, 'Precursor m/z ' + s.precursor.toFixed(5),s.instrument,'Collision energy ' + s.ce.join(' / ') + ' eV',s.mz.length + ' peaks'];
  $('#spectrumMeta').replaceChildren(...meta.map(t=>{const span=document.createElement('span');span.textContent=t;return span;}));
  const W=950,H=330,L=65,R=30,T=55,B=55,max=Math.max(s.precursor,...s.mz)*1.055,x=v=>L+v/max*(W-L-R),y=v=>H-B-v/100*(H-T-B);
  const strongest=s.intensity.map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v).slice(0,10);
  let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(s.id)} measured MS/MS spectrum"><title>${esc(s.id)} at ${esc(s.ce.join(' / '))} eV</title>`;
  for(const t of [0,25,50,75,100]) svg+=`<line x1="${L}" x2="${W-R}" y1="${y(t)}" y2="${y(t)}" stroke="#e7eae5"/><text x="${L-10}" y="${y(t)+4}" text-anchor="end" fill="#627270" font-size="12">${t}</text>`;
  for(let k=0;k<=5;k++){const v=max*k/5;svg+=`<text x="${x(v)}" y="${H-B+23}" text-anchor="middle" font-size="12" fill="#627270">${v.toFixed(1)}</text>`;}
  s.mz.forEach((mz,i)=>{svg+=`<line x1="${x(mz)}" x2="${x(mz)}" y1="${y(0)}" y2="${y(s.intensity[i])}" stroke="#147876" stroke-width="2"><title>m/z ${mz.toFixed(5)} · relative intensity ${s.intensity[i].toFixed(2)}</title></line>`;});
  let lastX=-100,tier=0;strongest.slice(0,5).sort((a,b)=>s.mz[a.i]-s.mz[b.i]).forEach(({i})=>{const xx=x(s.mz[i]);tier=xx-lastX<62?(tier+1)%3:0;lastX=xx;svg+=`<text x="${xx}" y="${Math.max(18,y(s.intensity[i])-12-tier*17)}" text-anchor="middle" font-size="12" fill="#233a3c">${s.mz[i].toFixed(3)}</text>`;});
  $('#spectrumChart').innerHTML=svg+`<text x="15" y="22" fill="#627270" font-size="12">Relative intensity</text><text x="${W-R}" y="${H-8}" text-anchor="end" fill="#627270" font-size="13">m/z</text></svg>`;
  $('#peakRows').innerHTML=strongest.map(({i})=>`<tr><td>${s.mz[i].toFixed(5)}</td><td>${s.intensity[i].toFixed(2)}</td><td>${(s.precursor-s.mz[i]).toFixed(5)}</td></tr>`).join('');
}
async function start() {
  try {
    const response=await fetch('data/cases.json');if(!response.ok)throw new Error('Unable to load case data.');
    cases=(await response.json()).cases;
    $('#caseJump').replaceChildren(...cases.map(c=>new Option(c.id+' · '+(c.group==='loss'?'lost':'gained')+' rank 1',c.id)));
    $('#caseSearch').addEventListener('input',renderLibrary);$('#groupFilter').addEventListener('change',renderLibrary);
    $('#caseJump').addEventListener('change',e=>{window.location.href=link(e.target.value);});
    $('#spectrumSelect').addEventListener('change',e=>renderSpectrum(Number(e.target.value)));
    renderLibrary();
    const selected=new URLSearchParams(location.search).get('case');
    if(selected){const c=cases.find(c=>c.id===selected);if(c){renderCase(c);const target=['#case-detail','#structures','#spectra','#review','#library'].includes(location.hash)?location.hash:'#case-detail';requestAnimationFrame(()=>$(target).scrollIntoView({block:'start'}));}else{$('#loadError').textContent='That case is not in the published subset. Choose one of the 17 cases below.';$('#loadError').hidden=false;}}
  } catch (error) {$('#loadError').textContent='The case library could not load. Please refresh the page or open the original case guide.';$('#loadError').hidden=false;$('#resultCount').textContent='Case data unavailable.';}
}
start();

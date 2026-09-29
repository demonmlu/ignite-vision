// Shared visual state supports hover, keyboard focus and touch activation.
(()=>{
 const hover=matchMedia('(hover:hover) and (pointer:fine)');
 document.querySelectorAll('.challenge-card').forEach(card=>{
  const button=card.querySelector('.challenge-toggle'),answer=card.querySelector('.answer');
  let pinned=false,over=false,focused=false;
  const render=()=>{const open=pinned||over||focused;card.classList.toggle('is-open',open);button.setAttribute('aria-expanded',String(open));answer.setAttribute('aria-hidden',String(!open));};
  card.addEventListener('pointerenter',e=>{if(hover.matches&&e.pointerType!=='touch'){over=true;render()}});
  card.addEventListener('pointerleave',()=>{over=false;render()});
  card.addEventListener('focusin',()=>{focused=hover.matches;render()});
  card.addEventListener('focusout',()=>{focused=false;render()});
  card.addEventListener('click',()=>{pinned=!pinned;render()});
  card.addEventListener('keydown',e=>{if(e.key==='Escape'){pinned=over=focused=false;render();button.blur()}});
  const placeArrow=()=>{const text=card.querySelector('p:not(.answer)');button.style.top=(text.offsetTop+text.offsetHeight+2)+'px'};
  new ResizeObserver(placeArrow).observe(card);placeArrow();
 });
})();

// Animate only numeric characters; units and the accessible final value stay fixed.
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const active=new Set();
 function start(){
  if(reduced.matches)return;
  document.querySelectorAll('.hero-stat .num').forEach((number,index)=>{
   const original=document.createElement('span');
   original.className='stat-reel-original';
   while(number.firstChild)original.append(number.firstChild);
   number.append(original);
   const overlay=document.createElement('span');overlay.className='stat-reel-overlay';overlay.setAttribute('aria-hidden','true');
   const animations=[];
   function copy(node,parent){
    if(node.nodeType===3){for(const char of node.textContent){
     if(!/\d/.test(char)){parent.append(document.createTextNode(char));continue}
     const digit=document.createElement('span'),track=document.createElement('span');
     digit.className='stat-reel-digit';track.className='stat-reel-track';
     const steps=20+Number(char);
     for(let i=0;i<=steps;i++){const row=document.createElement('span');row.textContent=String(i%10);track.append(row)}
     digit.append(track);parent.append(digit);
     animations.push({track,steps});
    }}else if(node.nodeType===1){const clone=node.cloneNode(false);parent.append(clone);node.childNodes.forEach(n=>copy(n,clone))}
   }
   original.childNodes.forEach(n=>copy(n,overlay));number.append(overlay);
   let running=[];
   const finish=()=>{running.forEach(a=>a.cancel());overlay.remove();original.replaceWith(...original.childNodes);active.delete(finish)};
   active.add(finish);
   running=animations.map(({track,steps},column)=>track.animate([{transform:'translateY(0)'},{transform:`translateY(-${steps}em)`}],{duration:1050+column*90,delay:index*100,easing:'cubic-bezier(.15,.7,.2,1)',fill:'both'}));
   Promise.all(running.map(a=>a.finished)).then(finish).catch(()=>{});
  });
 }
 reduced.addEventListener('change',()=>{if(reduced.matches)[...active].forEach(f=>f())});
 if(document.readyState==='complete')start();else addEventListener('load',start,{once:true});
})();

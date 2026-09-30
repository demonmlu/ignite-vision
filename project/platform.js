// Mobile navigation is independent of decorative canvas support.
(()=>{
 const toggle=document.querySelector('.menu-toggle');
 const menu=document.querySelector('#main-menu');
 const desktop=matchMedia('(min-width:901px)');
 function close(restore=false){menu.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');if(restore)toggle.focus()}
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));menu.classList.toggle('is-open',open)});
 menu.addEventListener('click',e=>{if(e.target.closest('a'))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true')close(true)});
 document.addEventListener('click',e=>{if(!e.target.closest('.nav'))close()});
 desktop.addEventListener('change',()=>close());
})();


// Preview preset: platform-hub-dark-v2, version 2; visual confirmation pending.
(()=>{const hero=document.querySelector('.platform-hero');let bg;function mount(){if(!bg&&window.IgniteBackgrounds)bg=IgniteBackgrounds.mount(hero,{preset:'platform-hub-dark-v2'})}mount();addEventListener('pagehide',()=>{bg?.destroy();bg=null});addEventListener('pageshow',mount)})();

// One-shot, viewport-triggered reels and baseline-anchored chart growth.
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(reduced.matches||!('IntersectionObserver' in window)||!Element.prototype.animate)return;
 const cleanups=new Set();
 function roll(group){
  group.querySelectorAll('strong').forEach((number,index)=>{
   const original=document.createElement('i');original.className='score-original';
   original.append(...number.childNodes);number.append(original);
   const overlay=document.createElement('i');overlay.className='score-reels';overlay.setAttribute('aria-hidden','true');
   const tracks=[];
   for(const node of original.childNodes){
    if(node.nodeType!==3){overlay.append(node.cloneNode(true));continue}
    for(const char of node.textContent){
     if(!/\d/.test(char)){overlay.append(char);continue}
     const digit=document.createElement('i'),track=document.createElement('i');
     digit.className='score-digit';track.className='score-track';
     const steps=20+Number(char);
     for(let i=0;i<=steps;i++){const row=document.createElement('i');row.textContent=i%10;track.append(row)}
     digit.append(track);overlay.append(digit);tracks.push({track,steps});
    }
   }
   number.append(overlay);
   const animations=tracks.map(({track,steps},column)=>track.animate([{transform:'translateY(0)'},{transform:`translateY(-${steps}em)`}],{duration:1050+column*90,delay:index*100,easing:'cubic-bezier(.15,.7,.2,1)',fill:'both'}));
   const finish=()=>{animations.forEach(a=>a.cancel());overlay.remove();original.replaceWith(...original.childNodes);cleanups.delete(finish)};
   cleanups.add(finish);Promise.all(animations.map(a=>a.finished)).then(finish).catch(()=>{});
  });
 }
 function grow(group){
  group.querySelectorAll('span').forEach((bar,index)=>{
   const animation=bar.animate([{transform:'scaleY(0)'},{transform:'scaleY(1)'}],{duration:650,delay:index*60,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});
   const finish=()=>{animation.cancel();cleanups.delete(finish)};
   cleanups.add(finish);animation.finished.then(finish).catch(()=>{});
  });
 }
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  observer.unobserve(entry.target);
  entry.target.matches('.scores')?roll(entry.target):grow(entry.target);
 }),{threshold:.25,rootMargin:'0px 0px -60px 0px'});
 document.querySelectorAll('.scores,.score-bars').forEach(el=>observer.observe(el));
 function stop(){observer.disconnect();[...cleanups].forEach(f=>f())}
 reduced.addEventListener('change',()=>{if(reduced.matches)stop()});
 addEventListener('pagehide',stop);
})();

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



// Candidate background: contact-coverage-dark-v2, v2; pending visual approval.
(()=>{
 const hero=document.querySelector('.contact-background');
 let background;
 function mount(){
  if(hero && window.IgniteBackgrounds && !background){
   background=IgniteBackgrounds.mount(hero,{preset:'contact-coverage-dark-v2'});
  }
 }
 function destroy(){background?.destroy();background=null;}
 window.addEventListener('pagehide',destroy);
 window.addEventListener('pageshow',mount);
 mount();
})();

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


// Source: hero-background-demo.html. solutions-adaptive-dark-v2, version 2, visual confirmation pending.
(()=>{const host=document.querySelector('.solutions-motion');let bg;
function mount(){if(!bg&&window.IgniteBackgrounds)bg=IgniteBackgrounds.mount(host,{preset:'solutions-adaptive-dark-v2'})}
mount();addEventListener('pagehide',()=>{bg?.destroy();bg=null});addEventListener('pageshow',mount);
const hero=document.querySelector('.solutions-hero');
hero.addEventListener('pointermove',e=>host.dispatchEvent(new PointerEvent('pointermove',{clientX:e.clientX,clientY:e.clientY,pointerType:e.pointerType})));
hero.addEventListener('pointerleave',()=>host.dispatchEvent(new PointerEvent('pointerleave')));
})();

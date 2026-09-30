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

// Source: hero-background-demo.html — about-constellation-dark-v3, version 3.
(()=>{
 const host=document.querySelector('.about-motion');
 let background;
 const hero=document.querySelector('.about-hero');
 hero.addEventListener('pointermove',event=>{
  if(event.target===host)return;
  const bounds=host.getBoundingClientRect();
  if(event.clientY<=bounds.bottom)host.dispatchEvent(new PointerEvent('pointermove',{clientX:event.clientX,clientY:event.clientY,pointerType:event.pointerType}));
  else host.dispatchEvent(new PointerEvent('pointerleave'));
 });
 hero.addEventListener('pointerleave',()=>host.dispatchEvent(new PointerEvent('pointerleave')));
 function mount(){if(!background&&window.IgniteBackgrounds)background=IgniteBackgrounds.mount(host,{preset:'about-constellation-dark-v3'})}
 mount();
 addEventListener('pagehide',()=>{background?.destroy();background=null});
 addEventListener('pageshow',()=>mount());
})();

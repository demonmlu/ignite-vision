(() => {
 const root=document.querySelector('.platform-comparison');
 // Preserve scheme two without initializing observers, events or animation timers.
 if(!root||root.dataset.comparisonEnabled==='false')return;
 const conservative=document.querySelector('#platform-conservative');
 const interactive=document.querySelector('#platform-interactive');
 let enabled=true,raf=0,last=0;
 const groups=[...interactive.querySelectorAll('.pi-accordion')].map(el=>({el,cards:[...el.children],index:0,elapsed:0,visible:false,hover:false,focus:false}));
 function select(g,index){g.index=index;g.elapsed=0;g.cards.forEach((c,i)=>{const active=i===index;c.classList.toggle('is-active',active);c.querySelector('button').setAttribute('aria-expanded',String(active));c.querySelector('.pi-body').setAttribute('aria-hidden',String(!active));c.querySelector('.pi-progress').style.transform='scaleX(0)';});}
 function measure(g){if(!enabled)return;let base=0,max=0;g.cards.forEach(c=>{const style=getComputedStyle(c);base+=c.querySelector('h3').getBoundingClientRect().height+parseFloat(style.paddingTop)+parseFloat(style.paddingBottom);max=Math.max(max,c.querySelector('.pi-body p').getBoundingClientRect().height);});g.el.style.minHeight=Math.ceil(base+max)+'px';}
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{const g=groups.find(g=>g.el===e.target);g.visible=e.isIntersecting;g.elapsed=0;}),{threshold:0});
 const resize=new ResizeObserver(()=>groups.forEach(measure));resize.observe(interactive);
 groups.forEach(g=>{
  select(g,0);observer.observe(g.el);
  g.cards.forEach((c,i)=>{
   c.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){g.hover=true;select(g,i);}});
   c.querySelector('button').addEventListener('click',()=>select(g,i));
  });
  g.el.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){g.hover=false;g.elapsed=0;}});
  g.el.addEventListener('focusin',e=>{if(e.target.matches(':focus-visible')){g.focus=true;select(g,g.cards.indexOf(e.target.closest('.pi-card')));}});
  g.el.addEventListener('focusout',e=>{if(!g.el.contains(e.relatedTarget)){g.focus=false;g.elapsed=0;}});
 });
 root.querySelectorAll('[data-variant]').forEach(button=>button.addEventListener('click',()=>{
  enabled=button.dataset.variant==='two';root.dataset.variant=enabled?'two':'one';
  conservative.hidden=enabled;interactive.hidden=!enabled;
  document.body.classList.toggle('platform-variant-two',enabled);
  root.querySelectorAll('[data-variant]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  // Previously hidden reveal elements must be readable immediately on comparison.
  if(!enabled)conservative.querySelectorAll('[data-reveal]').forEach(e=>{e.style.opacity='1';e.style.transform='none';});
  groups.forEach(g=>{g.hover=false;g.focus=false;select(g,0);measure(g);});
 }));
 document.addEventListener('visibilitychange',()=>groups.forEach(g=>g.elapsed=0));
 function tick(now){const dt=last?Math.min(now-last,100):0;last=now;groups.forEach(g=>{if(enabled&&g.visible&&!g.hover&&!g.focus&&!document.hidden){g.elapsed+=dt;if(g.elapsed>=5000)select(g,(g.index+1)%g.cards.length);g.cards[g.index].querySelector('.pi-progress').style.transform=`scaleX(${g.elapsed/5000})`;}});raf=requestAnimationFrame(tick);}
 const logo=interactive.querySelector('.pi-starry-logo img');
 function fitLogo(){if(logo.naturalWidth)logo.style.transform=`scale(${237*.983/logo.naturalWidth},${90*.8944/logo.naturalHeight})`;}
 logo.addEventListener('load',fitLogo);fitLogo();
 groups.forEach(measure);raf=requestAnimationFrame(tick);
 window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);observer.disconnect();resize.disconnect();});
 window.addEventListener('pageshow',e=>{if(e.persisted){groups.forEach(g=>{g.elapsed=0;observer.observe(g.el);});resize.observe(interactive);last=0;raf=requestAnimationFrame(tick);}});
})();

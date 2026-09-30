// One-shot entrance motion; content stays visible if motion/API is unavailable.
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(reduced.matches||!('IntersectionObserver' in window))return;
 const targets=[...document.querySelectorAll('[data-reveal], main > .trust-bar .trust-bar-inner, main > .section .section-title, main > .section .card-grid-4 > *, main > .section .card-grid-3 > *, main > .section .card-grid-2 > *, main > .stats-band .stat, main > .contact .cta-block')].filter(el=>!el.closest('header, footer, .hero, .about-hero, [data-reveal-exclude]'));
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('reveal-visible');observer.unobserve(entry.target)}});
 },{rootMargin:'0px 0px -60px 0px',threshold:0});
 targets.forEach(el=>{
  // Only stagger siblings on the same visual row, including responsive grids.
  const row=[...el.parentElement.children].filter(s=>s.offsetTop===el.offsetTop);
  el.style.setProperty('--reveal-delay',Math.min(Math.max(0,row.indexOf(el)),3)*60+'ms');
  el.classList.add('scroll-reveal');observer.observe(el);
 });
 reduced.addEventListener('change',()=>{if(reduced.matches){observer.disconnect();targets.forEach(el=>el.classList.add('reveal-visible'))}});
})();

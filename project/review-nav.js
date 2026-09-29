// Review-only navigation, shared by the two independent homepage variants.
(()=>{
 const light=document.documentElement.dataset.theme==='light';
 const nav=document.createElement('nav');nav.className='review-nav';nav.setAttribute('aria-label','版本评审导航');
 nav.innerHTML=`<a href="index.html">版本总览</a><span aria-hidden="true">│</span><a href="home-light.html" ${light?'aria-current="page"':''}>Light</a><a href="home.html" ${!light?'aria-current="page"':''}>Dark</a>`;
 document.body.append(nav);
 nav.querySelectorAll('a:not([href="index.html"])').forEach(link=>link.addEventListener('click',e=>{
  if(link.hasAttribute('aria-current')){e.preventDefault();return}
  const sections=[...document.querySelectorAll('main>section,footer')];
  const section=sections.find(el=>el.getBoundingClientRect().bottom>0);
  const position={index:sections.indexOf(section),fraction:section?Math.max(0,-section.getBoundingClientRect().top/section.offsetHeight):0};
  try{sessionStorage.setItem('home-review-position',JSON.stringify(position))}catch{}
 }));
 addEventListener('load',()=>{
  try{const saved=sessionStorage.getItem('home-review-position');sessionStorage.removeItem('home-review-position');if(!saved)return;
   const {index,fraction}=JSON.parse(saved);const section=[...document.querySelectorAll('main>section,footer')][index];
   if(section)scrollTo({top:section.getBoundingClientRect().top+scrollY+section.offsetHeight*fraction,behavior:'instant'});
  }catch{}
 },{once:true});
})();

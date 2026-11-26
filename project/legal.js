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




// Use the bilingual text supplied in the legal documents with the site language picker.
document.querySelectorAll('.legal-page [data-en][data-zh]').forEach(n=>{window.siteZh[n.dataset.en]=n.dataset.zh;});
const legalLanguageObserver=new MutationObserver(()=>{
 const zh=document.documentElement.lang==='zh-CN';
 document.querySelectorAll('.legal-page [data-en][data-zh]').forEach(n=>{n.textContent=zh?n.dataset.zh:n.dataset.en;});
});
legalLanguageObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

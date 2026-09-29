
(()=>{'use strict';
const hero=document.querySelector('.hero');
const canvas=hero.querySelector('.hero-particles'),ctx=canvas.getContext('2d');
if(!ctx)return;
let width=0,height=0,dpr=1,raf=0,last=0,time=0,paused=false,inView=true;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');paused=reduced.matches;
let seed=812;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
const TAU=Math.PI*2;
const light=document.documentElement.dataset.theme==='light';
const motion=light?'orbit':'galaxy';
let lightTime=0,rhythmTime=0,lightRate=1;
const ambientStrength=3; // Autonomous motion/brightness; pointer response stays unchanged.
const pointer={x:-1000,y:-1000,active:false};
// Independent frequencies keep the field from moving in a synchronized loop.
const nodes=Array.from({length:480},()=>({u:.06+random()*.9,v:.09+random()*.82,z:random(),phase:random()*TAU,speed:.35+random()*.4,drift:.18+random()*.16,pulsePhase:random()*TAU,pulseSpeed:.45+random()*.4,ox:0,oy:0}));
function draw(dt=0){
 ctx.clearRect(0,0,width,height);
 const influence=Math.min(240,width*.36),smooth=1-Math.exp(-dt*3.5);
 const points=nodes.slice(0,motion==='galaxy'?(width<600?240:480):(width<600?65:145)).map((n,i)=>{
  // Gentle independent wandering plus occasional 3–6px excursions.
  const pulse=Math.pow(Math.max(0,Math.sin(lightTime*n.pulseSpeed+n.pulsePhase)),8);
  // Sparse, smooth glints: independent 7–14 second cycles, no hard on/off.
  const glint=Math.pow(Math.max(0,Math.sin(lightTime*(.45+n.z*.4)*(light?1.25:1)+n.phase*2.37)),light?16:24);
  const excursion=Math.sin(time*n.drift*1.9+n.pulsePhase)*5;
  let bx=width*n.u+ambientStrength*(Math.sin(time*n.drift+n.phase)*14+Math.sin(time*.43+n.phase*2)*3+excursion);
  let by=height*n.v+ambientStrength*(Math.cos(time*n.drift*.79+n.phase*1.7)*11+Math.sin(time*.37+n.pulsePhase)*4);
  let depth=1,scale=1;
  if(motion==='galaxy'){
   // Four loose spiral arms viewed almost edge-on, spanning the viewport.
   const r=Math.pow(n.u,.75);
   const angle=(i%4)*TAU/4+r*4.8+(n.v-.5)*.7+time*.075;
   const x=Math.cos(angle)*r;
   const z=Math.sin(angle)*r;
   scale=1/(1-z*.22);
   bx=width*.5+x*width*.58*scale;
   by=height*.44+(z*Math.min(height*.15,width*.15)-x*Math.min(height*.12,width*.16)+(n.z-.5)*18)*scale;
   depth=.5+.5*(z+1)/2;
  }else if(motion!=='drift'){
   // A tilted annulus projected from 3D; a shared direction with varied radii.
   const angle=n.phase+time*(.19+n.z*.045);
   const radius=Math.min(width*.26,height*.39)*(.4+n.u*.62);
   const x=Math.cos(angle)*radius;
   const z=Math.sin(angle)*radius;
   const y=z*.43+(n.v-.5)*radius*.28;
   scale=1/(1-z/Math.max(width*.95,600));
   const center=motion==='travel'?.5+.19*Math.cos(time*TAU/20):.69;
   bx=width*center+(x*.96-y*.28)*scale;
   by=height*.46+(x*.28+y*.96)*scale;
   depth=.48+.52*(Math.sin(angle)+1)/2;
  }
  const dx=bx-pointer.x,dy=by-pointer.y,d=Math.hypot(dx,dy);
  const near=pointer.active?Math.max(0,1-d/influence):0;
  const force=near*near*38;
  n.ox+=((dx/Math.max(1,d))*force-n.ox)*smooth;
  n.oy+=((dy/Math.max(1,d))*force-n.oy)*smooth;
  const breath=Math.pow((1+Math.sin(lightTime*n.speed+n.phase))/2,2);
  const quiet=motion==='drift'?.3+.7*Math.min(1,Math.max(0,(n.u-.2)/.45)):depth;
  return{x:bx+n.ox,y:by+n.oy,glint:glint*quiet,a:Math.min(.85,(.025+(breath*.43+pulse*.24)*ambientStrength+near*.25)*quiet),pulse:Math.min(1,pulse*quiet*ambientStrength),near,z:n.z,scale};
 });
 ctx.lineWidth=.55;
 // Each point links to at most two neighbours: short, delicate fragments.
 const reach=motion==='galaxy'?Math.min(58,width*.12):Math.min(125,width*.2);
 for(let i=0;i<points.length;i++){
  const p=points[i];let neighbours=0;
  for(let j=i+1;j<points.length&&neighbours<2;j++){
   const q=points[j],d=Math.hypot(q.x-p.x,q.y-p.y);
   if(d<reach&&Math.abs(p.scale-q.scale)<.22){
    const proximity=Math.max(p.near,q.near);
    const alpha=(1-d/reach)*Math.min(p.a,q.a)*(.12+proximity*.65);
    if(alpha<.004)continue;
    ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
    ctx.strokeStyle=`rgba(${light?'151,85,65':'199,181,189'},${alpha})`;ctx.stroke();neighbours++;
   }
  }
 }
 for(const p of points){
  const red=p.z>(light?.3:.82);
  const color=light?(red?'218,35,40':'145,91,63'):(red?'239,82,99':'215,215,226');
  const shimmer=Math.max(p.near*.7,p.pulse*.45,p.glint);
  // Broad faint bloom plus a tighter luminous halo, behind a crisp point.
  const radius=(7+shimmer*(light?15:10))*p.scale;
  const glow=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,radius);
  glow.addColorStop(0,`rgba(${color},${p.a*.06+shimmer*(light?.36:.22)})`);
  glow.addColorStop(.28,`rgba(${color},${shimmer*(light?.13:.075)})`);
  glow.addColorStop(1,`rgba(${color},0)`);
  ctx.fillStyle=glow;ctx.fillRect(p.x-radius,p.y-radius,radius*2,radius*2);
  ctx.beginPath();ctx.arc(p.x,p.y,(.5+p.z*.65+p.near*.25+p.glint*(light?1.15:.65))*p.scale,0,TAU);
  ctx.fillStyle=`rgba(${color},${Math.min(1,p.a+p.glint*.5)})`;ctx.fill();
  if(p.glint>.15){
   ctx.beginPath();ctx.arc(p.x,p.y,.4+p.glint*.35,0,TAU);
   ctx.fillStyle=`rgba(${light?(red?'238,25,25':'166,86,43'):'255,245,245'},${p.glint*.85})`;ctx.fill();
  }
 }
}
hero.addEventListener('pointermove',e=>{
 if(paused||e.pointerType==='touch')return;
 const bounds=hero.getBoundingClientRect();
 pointer.x=(e.clientX-bounds.left)*width/bounds.width;
 pointer.y=(e.clientY-bounds.top)*height/bounds.height;pointer.active=true;
});
function release(){pointer.active=false}
hero.addEventListener('pointerleave',release);addEventListener('blur',release);
addEventListener('scroll',release,{passive:true});
function frame(now){raf=0;if(paused||document.hidden||!inView)return;const dt=last?Math.min((now-last)/1000,.05):0;time+=dt;
 rhythmTime+=dt;
 const targetRate=1.4+1.05*Math.cos(rhythmTime*TAU/8);
 lightRate+=(targetRate-lightRate)*(1-Math.exp(-dt*3));
 lightTime+=dt*lightRate;
 last=now;draw(dt);raf=requestAnimationFrame(frame)}
function sync(){cancelAnimationFrame(raf);raf=0;last=0;if(paused){release();nodes.forEach(n=>{n.ox=0;n.oy=0})}draw();if(!paused&&!document.hidden&&inView)raf=requestAnimationFrame(frame)}
function resize(){width=hero.clientWidth;height=hero.clientHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
new ResizeObserver(resize).observe(hero);
new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync()}).observe(hero);
addEventListener('resize',resize);document.addEventListener('visibilitychange',sync);
reduced.addEventListener('change',()=>{paused=reduced.matches;sync()});
resize();sync();
})();

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

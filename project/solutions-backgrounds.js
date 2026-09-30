(()=>{'use strict';
const presets={};
for(const motion of ['drift','orbit','travel','galaxy'])for(const theme of ['dark','light'])for(const rhythm of ['breathing','original']){
 const id=`home-${motion}-${theme}${rhythm==='original'?'-original':''}-v1`;
 presets[id]=Object.freeze({id,version:1,page:'home',motion,theme,rhythm,seed:812,ambientStrength:3,desktopParticles:motion==='galaxy'?480:145,mobileParticles:motion==='galaxy'?240:65,breathSeconds:8});
}
for(const theme of ['dark','light']){const id=`about-constellation-${theme}-v1`;presets[id]=Object.freeze({id,version:1,page:'about',motion:'constellation',theme,rhythm:'constellation',seed:812,ambientStrength:1,desktopParticles:170,mobileParticles:65,cycleSeconds:10,rotationSpeed:.028});}
// v1 remains available for exact extraction; v2 adds a tighter, drifting constellation rhythm.
for(const theme of ['dark','light']){const id=`about-constellation-${theme}-v2`;presets[id]=Object.freeze({...presets[`about-constellation-${theme}-v1`],id,version:2,cycleSeconds:6,rotationSpeed:.055,clusterRotationSpeed:.12,clusterDrift:true});}
for(const theme of ['dark','light']){const id=`about-constellation-${theme}-v3`;presets[id]=Object.freeze({...presets[`about-constellation-${theme}-v2`],id,version:3,pointerInteraction:true,pointerRadius:190,pointerForce:32});}
for(const theme of ['dark','light']){const id=`platform-hub-${theme}-v1`;presets[id]=Object.freeze({id,version:1,page:'platform',motion:'hub',theme,rhythm:'flow',seed:812,ambientStrength:1,cycleSeconds:6,desktopParticles:240,mobileParticles:100,pointerRadius:180});}
for(const theme of ['dark','light']){const id=`platform-hub-${theme}-v2`;presets[id]=Object.freeze({...presets[`platform-hub-${theme}-v1`],id,version:2,autonomousSway:true,coreParticles:76,coreRadius:76,coreRedRatio:.65});}
for(const theme of ['dark','light']){const id=`solutions-adaptive-${theme}-v1`;presets[id]=Object.freeze({id,version:1,page:'solutions',motion:'adaptive',theme,rhythm:'morph',seed:812,ambientStrength:1,desktopParticles:270,mobileParticles:120,morphSeconds:8,pointerRadius:180});}
for(const theme of ['dark','light']){const id=`solutions-adaptive-${theme}-v2`;presets[id]=Object.freeze({...presets[`solutions-adaptive-${theme}-v1`],id,version:2,morphSeconds:4,desktopCenterX:.67,desktopSpread:.32,desktopMaxRadius:470});}
const mounted=new WeakMap();
function mount(container,options={}){
 if(!(container instanceof HTMLElement))throw new Error('背景容器必须是 HTMLElement');
 const base=presets[options.preset];if(!base)throw new Error('未知背景方案：'+options.preset);
 mounted.get(container)?.destroy();
 const config={...base};
 const previousPosition=container.style.position,changedPosition=getComputedStyle(container).position==='static';
 if(changedPosition)container.style.position='relative';
 const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');
 Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'0',background:config.theme==='light'?'radial-gradient(ellipse at 76% 53%,#fff7f8 0,#fdfdfe 48%,#fff 78%)':'radial-gradient(ellipse at 76% 53%,#130d13 0,#0a0a0f 48%,#08080d 78%)'});
 container.prepend(canvas);const ctx=canvas.getContext('2d');
 let width=0,height=0,raf=0,last=0,time=0,paused=false,destroyed=false,frames=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),TAU=Math.PI*2;
 let seed=config.seed;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
 const ambientStrength=config.ambientStrength,light=config.theme==='light',motion=config.motion,breathing=config.rhythm==='breathing';
 let lightTime=0,rhythmTime=0,lightRate=1;
 const pointer={x:-1000,y:-1000,active:false};
 const nodes=Array.from({length:480},()=>({u:.06+random()*.9,v:.09+random()*.82,z:random(),phase:random()*TAU,speed:.35+random()*.4,drift:.18+random()*.16,pulsePhase:random()*TAU,pulseSpeed:.45+random()*.4,ox:0,oy:0}));
function drawHome(dt=0){
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

const clusterInteraction=Array.from({length:14},()=>({x:0,y:0,near:0}));
function drawAbout(dt=0){
 ctx.clearRect(0,0,width,height);const mobile=width<600,count=mobile?config.mobileParticles:config.desktopParticles;
 const smooth=1-Math.exp(-dt*3.5),points=[];
 for(let i=0;i<count;i++){
  const n=nodes[i],angle=n.phase+time*config.rotationSpeed;
  let x=width*(.79+Math.cos(angle)*(.08+n.u*.36));
  let y=height*(.5+Math.sin(angle)*(.18+n.v*.33));
  if(i%3===0){x=width*(n.u+.025*Math.sin(angle));y=height*(.82+.11*Math.cos(angle));}
  const dx=x-pointer.x,dy=y-pointer.y,d=Math.hypot(dx,dy),near=pointer.active?Math.max(0,1-d/150):0;
  n.ox+=((dx/Math.max(1,d))*near*near*15-n.ox)*smooth;n.oy+=((dy/Math.max(1,d))*near*near*15-n.oy)*smooth;
  const protectedText=mobile?y<height*.88:x<width*.72&&y<height*.72;
  const a=(.12+.22*(1+Math.sin(time*.4+n.phase))/2)*(protectedText?.18:1);
  n.hover=(n.hover||0)+((config.pointerInteraction?near:0)-(n.hover||0))*smooth;
  points.push({x:x+n.ox,y:y+n.oy,a:a+n.hover*.5,r:.5+n.z*.7+n.hover*.5,red:false,near:n.hover});
 }
 // Two staggered clusters, with a quiet tail. On narrow canvases use only the lower cluster.
 const centers=mobile?[[.72,.94]]:[[.84,.4],[.65,.85]];
 centers.forEach(([cx,cy],group)=>{
  const phase=((time+group*config.cycleSeconds/2+1.5)%config.cycleSeconds)/config.cycleSeconds;
  const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
  const enter=ease(phase/.22),fade=1-ease((phase-.68)/.24),visible=enter*fade;
  const connection=ease((phase-.18)/.2)*fade,activation=ease((phase-.36)/.15)*fade;
  const local=[];
  const moving=config.clusterDrift;
  const centerX=cx+(moving?Math.sin(time*.38+group*2.1)*(mobile?.035:.045):0);
  const centerY=cy+(moving?Math.cos(time*.31+group*1.7)*(mobile?.018:.045):0);
  for(let k=0;k<7;k++){
   const a=k*TAU/7+time*(config.clusterRotationSpeed||.018)+group+nodes[k+group*7].z*.8,spread=(1.5-enter*.5),radius=Math.min(width*.09,height*.16)*(.45+nodes[k+group*7].u*.7)*spread;
   const wanderX=moving?Math.sin(time*.85+k*1.7+group)*radius*.16:0;
   const wanderY=moving?Math.cos(time*.7+k*2.3+group)*radius*.13:0;
   const bx=width*centerX+Math.cos(a)*radius+wanderX,by=height*centerY+Math.sin(a)*radius*.65+wanderY;
   const state=clusterInteraction[group*7+k],dx=bx-pointer.x,dy=by-pointer.y,d=Math.hypot(dx,dy);
   const near=config.pointerInteraction&&pointer.active?Math.max(0,1-d/config.pointerRadius):0;
   state.x+=((dx/Math.max(1,d))*near*near*(config.pointerForce||0)-state.x)*smooth;
   state.y+=((dy/Math.max(1,d))*near*near*(config.pointerForce||0)-state.y)*smooth;
   state.near+=(near-state.near)*smooth;
   local.push({x:bx+state.x,y:by+state.y,a:Math.min(1,.65*visible+state.near*.55),r:1.1+state.near*.65,red:k<3&&(activation>.15||state.near>.2),near:state.near});
  }
  [[0,1],[1,3],[3,4],[3,6],[6,5],[5,2]].forEach(([from,to],k)=>{const p=local[from],q=local[to];ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.lineWidth=.65;ctx.strokeStyle=`rgba(${light?'151,85,65':'199,181,189'},${connection*.24+Math.max(p.near||0,q.near||0)*.3})`;ctx.stroke();
   if(phase>.36&&phase<.72){const travel=(phase-.36)/.36,t=Math.max(0,Math.min(1,travel*2-k*.13));points.push({x:p.x+(q.x-p.x)*t,y:p.y+(q.y-p.y)*t,a:activation*.6,r:.9,red:true});}
  });points.push(...local);
 });
 if(config.pointerInteraction){
  for(let i=0;i<points.length;i++){const p=points[i];if(!(p.near>.05))continue;let links=0;
   for(let j=i+1;j<points.length&&links<2;j++){const q=points[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d>85||!(q.near>.05))continue;
    ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.lineWidth=.6;ctx.strokeStyle=`rgba(${light?'170,85,80':'225,160,155'},${(1-d/85)*Math.min(p.near,q.near)*.4})`;ctx.stroke();links++;
   }
  }
 }
 for(const p of points){const color=p.red?'222,55,51':light?'135,105,105':'211,213,224',radius=p.red?13:6;const glow=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,radius);glow.addColorStop(0,`rgba(${color},${p.a*(p.red?.32:.12)})`);glow.addColorStop(1,`rgba(${color},0)`);ctx.fillStyle=glow;ctx.fillRect(p.x-radius,p.y-radius,radius*2,radius*2);ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,TAU);ctx.fillStyle=`rgba(${color},${p.a})`;ctx.fill();}
}
// Platform: independent curved streams converge on one hub and leave as ordered signals.
const hubOffsets=Array.from({length:240},()=>({x:0,y:0,near:0}));
function drawPlatform(dt=0){
 ctx.clearRect(0,0,width,height);
 const mobile=width<600,sway=config.autonomousSway;
 const cx=width*((mobile?.68:.79)+(sway?Math.sin(time*.34)*.018:0)),cy=height*((mobile?.78:.56)+(sway?Math.cos(time*.29)*.025:0)),smooth=1-Math.exp(-dt*4);
 const anchors=mobile?[[.12,.62],[.22,.92],[.92,.43],[.97,.93]]:[[.32,.82],[.52,.94],[.96,.17],[.98,.83]];
 const color=light?'132,101,105':'206,209,223',red='222,55,51';
 function point(x,y,r,a,isRed=false){const c=isRed?red:color,glow=ctx.createRadialGradient(x,y,0,x,y,isRed?12:7);glow.addColorStop(0,`rgba(${c},${a*.22})`);glow.addColorStop(1,`rgba(${c},0)`);ctx.fillStyle=glow;ctx.fillRect(x-12,y-12,24,24);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle=`rgba(${c},${a})`;ctx.fill();}
 function route(lane,t){const [ax,ay]=anchors[lane];const x0=(ax+(sway?Math.sin(time*.43+lane*1.7)*(mobile?.035:.045):0))*width,y0=(ay+(sway?Math.cos(time*.37+lane*2.1)*.04:0))*height;const bend=Math.sin(time*(sway?.48:.24)+lane)*height*(sway?.075:.018);const controlX=(x0+cx)/2+(lane%2?1:-1)*width*.05+(sway?Math.sin(time*.4+lane*1.9)*width*.06:0),controlY=(y0+cy)/2-height*.12+bend;return {x:(1-t)*(1-t)*x0+2*(1-t)*t*controlX+t*t*cx,y:(1-t)*(1-t)*y0+2*(1-t)*t*controlY+t*t*cy};}
 // Fine, subdued guides establish repeatable paths without a rigid diagram.
 for(let lane=0;lane<anchors.length;lane++){
  ctx.beginPath();for(let j=0;j<=32;j++){const p=route(lane,j/32);j?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)}ctx.lineWidth=.5;ctx.strokeStyle=`rgba(${color},.085)`;ctx.stroke();
  const arrival=(time/config.cycleSeconds+lane*.25)%1,flash=Math.pow(Math.max(0,1-Math.abs(arrival-.85)/.18),2),end=route(lane,0);point(end.x,end.y,1.4+flash,.22+flash*.55,true);
 }
 const count=mobile?config.mobileParticles:config.desktopParticles;
 for(let i=0;i<count;i++){
  const n=nodes[i],lane=i%4,phase=(time/config.cycleSeconds+n.u+lane*.13)%1;
  const outgoing=i%5===0,t=outgoing?1-phase:phase,p=route(lane,t);
  const spread=Math.sin(Math.PI*t)*(mobile?6:14);
  p.x+=Math.sin(n.phase+time*.35)*spread;p.y+=Math.cos(n.phase+time*.3)*spread;
  const dx=p.x-pointer.x,dy=p.y-pointer.y,d=Math.hypot(dx,dy),near=pointer.active?Math.max(0,1-d/config.pointerRadius):0,state=hubOffsets[i];
  state.x+=((dx/Math.max(1,d))*near*near*22-state.x)*smooth;state.y+=((dy/Math.max(1,d))*near*near*22-state.y)*smooth;state.near+=(near-state.near)*smooth;
  const fade=Math.sin(Math.PI*phase),a=(.14+n.z*.42)*fade+state.near*.35;
  point(p.x+state.x,p.y+state.y,.55+n.z*.55+state.near*.5,a,outgoing);
  if(state.near>.2&&i%5===0){const q=route(lane,Math.min(1,t+.035));ctx.beginPath();ctx.moveTo(p.x+state.x,p.y+state.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(${red},${state.near*.25})`;ctx.stroke()}
 }
 // The nucleus breathes and rotates autonomously, sharing the moving stream endpoint.
 const coreCount=sway?(mobile?48:config.coreParticles):18;
 const coreRadius=sway?Math.min(config.coreRadius,width*.16):30;
 const breath=1+(sway?Math.sin(time*1.05)*.09:0);
 for(let i=0;i<coreCount;i++){const n=nodes[i],a=n.phase+time*(.22+(sway?n.z*.16:0)),r=sway?(10+Math.sqrt(n.z)*(coreRadius-10))*breath:8+n.z*22;
  const z=Math.sin(a),depth=.7+(z+1)*.15;
  point(cx+Math.cos(a)*r,cy+Math.sin(a)*r*(sway?.64:.5),(.7+n.z*.6)*depth,(.25+n.z*.3)*(sway?1.12:1),sway?n.u<config.coreRedRatio:i%4===0);
 }
 for(let i=0;i<45;i++){const n=nodes[i];point(width*n.u,height*n.v,.5,.025+.055*(1+Math.sin(time*.4+n.phase))/2)}
}
// Solutions: the same particles reshape into complementary, tailored formations.
const solutionOffsets=Array.from({length:270},()=>({x:0,y:0,near:0}));
function drawSolutions(dt=0){
 ctx.clearRect(0,0,width,height);
 const mobile=width<600,count=mobile?config.mobileParticles:config.desktopParticles,smooth=1-Math.exp(-dt*4);
 const phase=time/config.morphSeconds,stage=Math.floor(phase)%3,fraction=phase%1;
 const blend=(1-Math.cos(Math.PI*fraction))/2;
 const cx=width*(mobile?.62:(config.desktopCenterX??.77))+Math.sin(time*.32)*width*.025,cy=height*(mobile?.78:.59)+Math.cos(time*.29)*height*.035;
 const sx=Math.min(width*(mobile?.42:(config.desktopSpread??.23)),config.desktopMaxRadius??330),sy=Math.min(height*.25,145),points=[];
 function form(mode,n,i){const lane=i%3,u=n.u,a=n.phase+time*.17;
  if(mode===0)return {x:(u*2-1)*sx,y:Math.sin(u*TAU+time*.42+lane*.65)*sy*.23+(lane-1)*sy*.32};
  if(mode===1){const r=(.25+n.z*.6);return {x:((lane-1)*.78+Math.cos(a)*r*.43)*sx,y:Math.sin(a)*r*sy*.62+(lane-1)*sy*.17};}
  return {x:(u*2-1)*sx,y:(lane-1)*sy*.7*Math.sin(u*Math.PI/2)+Math.sin(u*5+time*.4)*sy*.14};
 }
 for(let i=0;i<count;i++){
  const n=nodes[i],a=form(stage,n,i),b=form((stage+1)%3,n,i);
  let x=cx+a.x*(1-blend)+b.x*blend,y=cy+a.y*(1-blend)+b.y*blend;
  x+=Math.sin(time*.7+n.phase)*3;y+=Math.cos(time*.6+n.phase)*3;
  const dx=x-pointer.x,dy=y-pointer.y,d=Math.hypot(dx,dy),near=pointer.active?Math.max(0,1-d/config.pointerRadius):0,o=solutionOffsets[i];
  o.x+=((dx/Math.max(1,d))*near*near*28-o.x)*smooth;o.y+=((dy/Math.max(1,d))*near*near*28-o.y)*smooth;o.near+=(near-o.near)*smooth;
  const depth=.65+.35*(1+Math.sin(n.phase+time*.17))/2;
  points.push({x:x+o.x,y:y+o.y,a:(.18+n.z*.42)*depth+o.near*.3,r:(.55+n.z*.65)*depth+o.near*.4,red:i%5===0,near:o.near});
 }
 for(let i=0;i<points.length;i++){const p=points[i];let links=0;
  for(let j=i+1;j<points.length&&links<2;j++){const q=points[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d>40)continue;
   ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.lineWidth=.55;ctx.strokeStyle=`rgba(${light?'150,95,95':'206,191,199'},${(1-d/40)*Math.min(p.a,q.a)*(.2+Math.max(p.near,q.near)*.4)})`;ctx.stroke();links++;
  }
 }
 for(const p of points){const color=p.red?'222,55,51':light?'140,108,105':'209,212,226',radius=p.red?12:7;const glow=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,radius);glow.addColorStop(0,`rgba(${color},${p.a*.22})`);glow.addColorStop(1,`rgba(${color},0)`);ctx.fillStyle=glow;ctx.fillRect(p.x-radius,p.y-radius,radius*2,radius*2);ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,TAU);ctx.fillStyle=`rgba(${color},${p.a})`;ctx.fill();}
}
function draw(dt=0){if(!ctx||destroyed)return;motion==='adaptive'?drawSolutions(dt):motion==='hub'?drawPlatform(dt):motion==='constellation'?drawAbout(dt):drawHome(dt);}
function frame(now){raf=0;if(destroyed||paused||reduced.matches||document.hidden||!ctx)return;const dt=last?Math.min((now-last)/1000,.05):0;last=now;time+=dt;rhythmTime+=dt;const targetRate=breathing?1.4+1.05*Math.cos(rhythmTime*TAU/8):1;lightRate+=(targetRate-lightRate)*(1-Math.exp(-dt*3));lightTime+=dt*lightRate;draw(dt);frames++;raf=requestAnimationFrame(frame);}
function sync(){cancelAnimationFrame(raf);raf=0;last=0;draw();if(!destroyed&&!paused&&!reduced.matches&&!document.hidden&&ctx)raf=requestAnimationFrame(frame);}
function resize(){const r=container.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);draw();}
function release(){pointer.active=false;}
function pointerMove(e){if(paused||reduced.matches||e.pointerType==='touch')return;const r=container.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;pointer.active=true;}
function preference(){release();sync();}
container.addEventListener('pointermove',pointerMove);container.addEventListener('pointerleave',release);window.addEventListener('blur',release);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',preference);
const observer=new ResizeObserver(resize);observer.observe(container);
const api={pause(){paused=true;release();sync()},resume(){paused=false;sync()},destroy(){if(destroyed)return;destroyed=true;cancelAnimationFrame(raf);raf=0;observer.disconnect();container.removeEventListener('pointermove',pointerMove);container.removeEventListener('pointerleave',release);window.removeEventListener('blur',release);document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',preference);canvas.remove();if(changedPosition)container.style.position=previousPosition;mounted.delete(container)},getState(){return {preset:config.id,paused,reducedMotion:reduced.matches,destroyed,running:!!raf,frames,width,height,canvasSupported:!!ctx}}};
mounted.set(container,api);resize();sync();return api;
}
window.IgniteBackgrounds=Object.freeze({presets:Object.freeze(presets),mount});
})();

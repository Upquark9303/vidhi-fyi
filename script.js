// tabs + subtabs + playful touch effects
function activateTab(name){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active',p.id==='tab-'+name));
  requestAnimationFrame(observeReveals);
}
function activateSub(panel,scope){
  const c=scope.closest('.tab-panel')||document;
  scope.querySelectorAll('.subtab-btn').forEach(b=>b.classList.toggle('active',b.dataset.subtab===panel));
  c.querySelectorAll('.sub-panel').forEach(p=>{
    const key=p.id.replace(/^sub-/,'');
    const belongs=[...scope.querySelectorAll('.subtab-btn')].some(b=>b.dataset.subtab===key);
    if(belongs)p.classList.toggle('active',key===panel);
  });
}
document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',e=>{
  activateTab(b.dataset.tab);history.replaceState(null,'','#'+b.dataset.tab);
  document.querySelector('.tabs').scrollIntoView({behavior:'smooth',block:'start'});
  burst(e.clientX,e.clientY);
}));
document.querySelectorAll('.subtabs').forEach(g=>g.querySelectorAll('.subtab-btn').forEach(b=>b.addEventListener('click',()=>activateSub(b.dataset.subtab,g))));
document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>activateTab(b.dataset.goto)));
const h=(location.hash||'').replace('#','');if(h&&document.getElementById('tab-'+h))activateTab(h);
// scroll reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
function observeReveals(){document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el));}
observeReveals();
// 3D tilt on touch/mouse
document.querySelectorAll('.tilt').forEach(card=>{
  const move=(x,y,r)=>{
    const px=(x-r.left)/r.width-.5, py=(y-r.top)/r.height-.5;
    card.style.transform=`rotateY(${px*14}deg) rotateX(${-py*14}deg) translateY(-4px)`;
  };
  card.addEventListener('mousemove',e=>move(e.clientX,e.clientY,card.getBoundingClientRect()));
  card.addEventListener('mouseleave',()=>card.style.transform='');
  card.addEventListener('touchmove',e=>{const t=e.touches[0];move(t.clientX,t.clientY,card.getBoundingClientRect());},{passive:true});
  card.addEventListener('touchend',()=>card.style.transform='');
});
// emoji burst on click
function burst(x,y){
  const em=['✨','🔬','✈️','💡','🌍'];const s=document.createElement('div');
  s.className='float-emoji';s.textContent=em[Math.floor(Math.random()*em.length)];
  s.style.left=x+'px';s.style.top=y+'px';document.body.appendChild(s);setTimeout(()=>s.remove(),1000);
}
document.addEventListener('click',e=>{if(e.target.closest('.travel-card,.post'))burst(e.clientX,e.clientY);});

// glass touch
document.querySelectorAll('.card,.post,.travel-card,.interests,.tilt').forEach(el=>el.classList.add('glass'));


// travel cards open the matching story
document.querySelectorAll('[data-story]').forEach(c=>c.addEventListener('click',()=>{const panel=document.getElementById('tab-travel');const btn=panel?panel.querySelector('.subtabs .subtab-btn[data-subtab="'+c.dataset.story+'"]'):null;if(btn)btn.click();const t=document.getElementById('sub-'+c.dataset.story);if(t)t.scrollIntoView({behavior:'smooth',block:'start'});}));


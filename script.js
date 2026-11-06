const PHOTOS=["images/photo1.jpg", "images/photo2.jpg", "images/photo3.jpg", "images/photo4.jpg", "images/photo5.jpg", "images/photo6.jpg"];
const track=document.getElementById('track'),dots=document.getElementById('dots');
const CAPTIONS=['Si hooded blanket 🙈','Peace! Walang away ✌️','Action shot: 📸','Pusang may whiskers 🐱','Dila power! 😜','Chef Einal, MasterChef na 🧄'];
PHOTOS.forEach((src,i)=>{
  const f=document.createElement('figure');f.className='photo';
  const im=new Image();im.src=src;im.alt='Photo '+(i+1);f.appendChild(im);const cap=document.createElement('figcaption');cap.textContent=CAPTIONS[i]||'';f.appendChild(cap);track.appendChild(f);
  const d=document.createElement('i');if(!i)d.className='on';dots.appendChild(d);
});
track.addEventListener('scroll',()=>{
  const c=track.children[0].offsetWidth+14;
  const idx=Math.min(PHOTOS.length-1,Math.round(track.scrollLeft/c));
  [...dots.children].forEach((d,i)=>d.classList.toggle('on',i===idx));
},{passive:true});

const cv=document.getElementById('confetti'),cx=cv.getContext('2d');
let parts=[],raf;
function size(){cv.width=innerWidth;cv.height=innerHeight}size();addEventListener('resize',size);
function burst(){
  const cols=['#ff7eb6','#ffd86b','#7df0c8','#fff8ee','#a78bfa'];
  for(let i=0;i<150;i++)parts.push({x:innerWidth/2,y:innerHeight*.55,vx:(Math.random()-.5)*16,vy:-Math.random()*16-4,s:Math.random()*7+4,c:cols[i%5],r:Math.random()*6,vr:(Math.random()-.5)*.4});
  cancelAnimationFrame(raf);tick();
}
function tick(){
  cx.clearRect(0,0,cv.width,cv.height);
  parts.forEach(p=>{p.vy+=.35;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;
    cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);cx.restore()});
  parts=parts.filter(p=>p.y<cv.height+20);
  if(parts.length)raf=requestAnimationFrame(tick);
}
document.getElementById('openBtn').addEventListener('click',()=>{
  document.getElementById('intro').style.display='none';
  const m=document.getElementById('main');m.classList.add('show');scrollTo(0,0);
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches)burst();
  startMusic();
});

/* Music: "Happy Birthday" played as a music box (Web Audio, no audio file needed) */
const SONG=[[392,.75],[392,.25],[440,1],[392,1],[523.25,1],[493.88,2],
[392,.75],[392,.25],[440,1],[392,1],[587.33,1],[523.25,2],
[392,.75],[392,.25],[783.99,1],[659.25,1],[523.25,1],[493.88,1],[440,2],
[698.46,.75],[698.46,.25],[659.25,1],[523.25,1],[587.33,1],[523.25,2]];
const BEAT=.5;let ac,master,nextStart=0,timer,playing=false;
const mBtn=document.getElementById('musicBtn');
function note(f,t,d){
  const o=ac.createOscillator(),g=ac.createGain();
  o.type='triangle';o.frequency.value=f;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.35,t+.01);
  g.gain.exponentialRampToValueAtTime(.001,t+Math.max(d,.9));
  o.connect(g);g.connect(master);o.start(t);o.stop(t+Math.max(d,.9)+.05);
}
function playSong(){
  let t=Math.max(nextStart,ac.currentTime+.05);
  SONG.forEach(([f,b])=>{note(f,t,b*BEAT);t+=b*BEAT});
  nextStart=t+1.5;
}
function startMusic(){
  try{
    ac=new (window.AudioContext||window.webkitAudioContext)();
    master=ac.createGain();master.gain.value=.5;master.connect(ac.destination);
    playSong();
    timer=setInterval(()=>{if(ac.state==='running'&&ac.currentTime>=nextStart-.3)playSong()},200);
    playing=true;mBtn.hidden=false;
  }catch(e){}
}
mBtn.addEventListener('click',()=>{
  if(!ac)return;
  if(playing){ac.suspend();playing=false;mBtn.classList.add('off')}
  else{ac.resume();playing=true;mBtn.classList.remove('off')}
});

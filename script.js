// Simple interactions + confetti + evasive "No" button
const askBtn = document.getElementById('askBtn');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeBtn');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const recipientNameEl = document.getElementById('recipientName');
const loveMsgEl = document.getElementById('loveMsg');
const senderNameEl = document.getElementById('senderName');
const modalCard = document.querySelector('.modal-card');

const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');
let W, H;

function resizeCanvas(){
  W = confettiCanvas.width = window.innerWidth;
  H = confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

askBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
});

// close actions
closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

noBtn.addEventListener('click', (e) => {
  // Prevent the "No" from being clicked; move it away instead.
  e.preventDefault();
  moveNoButton();
});

noBtn.addEventListener('mouseenter', moveNoButton);

// Move the No button to a new random spot (within safe bounds of the modal)
function moveNoButton(){
  // Get modal/card dimensions
  const cardRect = modalCard.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // Padding so button doesn't go flush to edges
  const padding = 12;

  // Compute maximum offsets relative to the button's current position
  const maxX = Math.max(0, (cardRect.width - btnRect.width) / 2 - padding);
  const maxY = Math.max(0, (cardRect.height - btnRect.height) / 2 - 40);

  // Random offset centered around 0
  const x = (Math.random() * 2 - 1) * maxX;
  const y = (Math.random() * 2 - 1) * maxY;

  noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

// If the user actually manages to click "Yes"
yesBtn.addEventListener('click', () => {
  loveMsgEl.textContent = "Yay! You just made my day. 💖";
  yesBtn.disabled = true;
  noBtn.disabled = true;
  runConfetti(150);
});

// Quick way to set names/messages by editing these variables:
const recipientName = "Vimanshi";   // changed
const senderName = "Suraj";         // changed
const personalMessage = "Will you be my valentine?"; // changed

// Apply defaults
recipientNameEl.textContent = recipientName;
senderNameEl.textContent = senderName;
loveMsgEl.textContent = personalMessage;

// --- Simple confetti ---
function random(min, max){ return Math.random()*(max-min)+min }
class Particle {
  constructor(){
    this.x = random(0, W);
    this.y = random(-H, 0);
    this.w = random(6, 12);
    this.h = random(8, 16);
    this.color = `hsl(${Math.floor(random(0,360))}deg 80% 60%)`;
    this.vx = random(-1.5, 1.5);
    this.vy = random(2, 6);
    this.rot = random(0, 360);
    this.rotSpeed = random(-8, 8);
  }
  update(){
    this.x += this.vx;
    this.y += this.vy;
    this.rot += this.rotSpeed;
    if(this.y > H + 20) this.y = random(-H, -10);
  }
  draw(ctx){
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot * Math.PI/180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
    ctx.restore();
  }
}

let particles = [];
let confettiRunning = false;
function runConfetti(count = 80){
  particles = [];
  for(let i=0;i<count;i++) particles.push(new Particle());
  confettiRunning = true;
  requestAnimationFrame(loop);
  // stop after a bit
  setTimeout(()=> confettiRunning = false, 4000);
}

function loop(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p => { p.update(); p.draw(ctx); });
  if(confettiRunning) requestAnimationFrame(loop);
  else { // gentle fade out
    let still = false;
    for(let p of particles) if(p.y < H+50) still = true;
    if(still) requestAnimationFrame(loop);
    else ctx.clearRect(0,0,W,H);
  }
}
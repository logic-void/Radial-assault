const canvas = document.getElementById("mycanvas");
const c = canvas.getContext("2d");
const startbtn = document.querySelector(".btn");
const container = document.querySelector(".container");
c.fillStyle = "black";
function resizecanvas(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resizecanvas();
c.fillRect(0,0,canvas.width,canvas.height);
addEventListener("resize",resizecanvas);

class Player{
  constructor(x,y,radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = "white";
  }
  draw(){
    c.beginPath();
    c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }
  update(){
    this.draw();
  }
}
class Enemy{
  constructor(x,y,radius,color){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.angle = Math.atan2(canvas.height/2 - this.y,canvas.width/2 - this.x);
    this.factor = (Math.random()*2)+1;
    this.velx = Math.cos(this.angle)*this.factor;
    this.vely = Math.sin(this.angle)*this.factor;
  }
  draw(){
    c.beginPath();
    c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }
  update(){
    this.draw();
    this.x += this.velx;
    this.y += this.vely;
  }
}
class Bullet{
  constructor(x,y,radius,velx,vely){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = "white";
    this.velx = velx;
    this.vely = vely;
  }
  draw(){
    c.beginPath();
    c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }
  update(){
    this.draw();
    this.x += this.velx;
    this.y += this.vely;
  }
}
class Particle{
  constructor(x,y,radius,color,velx,vely){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velx = velx;
    this.vely = vely;
    this.opacity = 1;
  }
  draw(){
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }
  update(){
    this.draw();
    this.opacity = Math.max(0,this.opacity-0.03);
    this.x += this.velx;
    this.y += this.vely;
  }
}
function animate(){
  const gameID = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.1)";
  c.fillRect(0,0,canvas.width,canvas.height);
  c.fillStyle = "white";
  c.font = "bold 20px Arial"
  c.fillText(`Score: ${score}`,10,30);
  player.update();
  enemies.forEach((enemy,enemyindex)=>{
    enemy.update();
    if(Math.hypot(enemy.x-player.x,enemy.y-player.y) <= enemy.radius + player.radius){
      cancelAnimationFrame(gameID);
      document.querySelector(".scoretext").textContent = score;
      container.style.display = "flex";
    }
    bullets.forEach((bullet,bulletindex)=>{
      bullet.update();
      if(bullet.x+bullet.radius>canvas.width || bullet.x-bullet.radius<0 || bullet.y+bullet.radius>canvas.height || bullet.y-bullet.radius<0){
        bullets.splice(bulletindex,1);
      }
      if(Math.hypot(enemy.x-bullet.x,enemy.y-bullet.y) <= enemy.radius + bullet.radius){
        if(enemy.radius>=15){
          score += 100;
          gsap.to(enemy, {
            radius: "-=10",
            duration: 0.5
          });
          for(let i = 0;i<8;i++){
            particles.push(new Particle(enemy.x,enemy.y,(Math.random()*2)+1,enemy.color,Math.cos(Math.random()*Math.PI*2)*5,Math.sin(Math.random()*Math.PI*2)*5));
          }
          bullets.splice(bulletindex,1);
        }else{
          score += 250;
          enemies.splice(enemyindex,1);
          bullets.splice(bulletindex,1);
          for(let i = 0;i<15;i++){
            particles.push(new Particle(enemy.x,enemy.y,(Math.random()*2)+1,enemy.color,Math.cos(Math.random()*Math.PI*2)*5,Math.sin(Math.random()*Math.PI*2)*5));
        }
      }}
  })
  particles.forEach((particle,particleindex)=>{
    particle.update();
    if(particle.opacity<=0){
      particles.splice(particleindex,1);
    }
  })
  })
}
const player = new Player(canvas.width/2,canvas.height/2,20);
let enemies;
let bullets;
let particles;
let running = false;
let score = 0;
setInterval(()=>{
  if(running){
    let x,y;
    if(Math.random()<0.5){
      x = (Math.random()*(canvas.width+60))-30;
      y = Math.random()<0.5 ? -30:canvas.height+30;
    } else{
      x = Math.random()<0.5 ? -30:canvas.width+30;
      y = (Math.random()*(canvas.height+60))-30;
    }
    enemies.push(new Enemy(x,y,(Math.random()*25)+5,`hsl(${Math.random()*360},100%,50%)`));
}},1000)
addEventListener("pointerdown",e=>{
  if(running){
    const angle = Math.atan2(e.clientY-canvas.height/2,e.clientX-canvas.width/2);
    bullets.push(new Bullet(canvas.width/2,canvas.height/2,6,Math.cos(angle)*7,Math.sin(angle)*7));
  }
})
function init(){
  enemies = [];
  bullets = [];
  particles = [];
  score = 0;
  running = true;
  animate();
}
startbtn.addEventListener("click",()=>{
  container.style.display = "none";
  init();
})
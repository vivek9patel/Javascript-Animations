const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const numOfParticles = Math.random() * (120 - 80) + 80;
const maxParticleSpeed = Math.random() * (5 - 1) + 1;
const particleColor =
  "rgb(" +
  Math.random() * 255 +
  ", " +
  Math.random() * 255 +
  ", " +
  Math.random() * 255 +
  ")";
const lineColor =
  "rgb(" +
  Math.random() * 255 +
  ", " +
  Math.random() * 255 +
  ", " +
  Math.random() * 255 +
  ",";
const lineDistanceDevider = Math.random() * (20 - 1) + 1;
const lineOpacityDevider = Math.random() * (200 - 20) + 20;
const mouseRadius = 100;
const particleStorkeColor = Math.random() < 0.5;
const particleBorderWidth = (Math.random() * (20 - 1) + 1).toString();
const particlesLineWidth = Math.random() * (10).toString();

console.log(
  numOfParticles,
  maxParticleSpeed,
  particleColor,
  lineDistanceDevider,
  lineOpacityDevider,
  mouseRadius,
  particleStorkeColor,
  particleBorderWidth,
  particlesLineWidth
);

let particles = [];

let mouse = {
  x: null,
  y: null,
  radius: mouseRadius,
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});
window.addEventListener("mouseout", (e) => {
  mouse.x = null;
  mouse.y = null;
});
class particle {
  constructor(x, y, radius, dirX, dirY) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dirX = dirX;
    this.dirY = dirY;
  }
  draw() {
    ctx.beginPath();
    ctx.lineWidth = particleBorderWidth;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = particleColor;
    if (particleStorkeColor) ctx.fill();
    else ctx.stroke();
  }
  update() {
    // Canvas body collision
    if (this.x > canvas.width) {
      this.dirX *= -1;
      //   this.dirX += 0.5;
    } else if (this.x < 0) {
      this.dirX *= -1;
      //   this.dirX -= 0.5;
    }
    if (this.y > canvas.height) {
      this.dirY *= -1;
      //   this.dirY += 0.5;
    } else if (this.y < 0) {
      this.dirY *= -1;
      //   this.dirY -= 0.5;
    }

    // Mouse collision
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius + this.radius) {
      if (mouse.x < this.x && this.x < canvas.width - this.radius) {
        this.x += 10;
        this.dirX *= -1;
      }
      if (mouse.x > this.x && this.x > this.radius) {
        this.x -= 10;
        this.dirX *= -1;
      }
      if (mouse.y < this.y && this.y < canvas.height - this.radius) {
        this.y += 10;
        this.dirY *= -1;
      }
      if (mouse.y > this.y && this.y > this.radius) {
        this.y -= 10;
        this.dirY *= -1;
      }
    }
    // for (let i = 0; i < numOfParticles; i++) {
    //   if (particles[i].x == this.x && particles[i].y == this.y) continue;
    //   let dx = particles[i].x - this.x;
    //   let dy = particles[i].y - this.y;
    //   let distance = Math.sqrt(dx * dx + dy * dy);
    //   if (distance < particles[i].radius + this.radius) {
    //     if (particles[i].x < this.x && this.x < canvas.width - this.radius) {
    //       this.x += 1;
    //       this.dirX *= -1;
    //     }
    //     if (particles[i].x > this.x && this.x > this.radius) {
    //       this.x -= 1;
    //       this.dirX *= -1;
    //     }
    //     if (particles[i].y < this.y && this.y < canvas.height - this.radius) {
    //       this.y += 1;
    //       this.dirY *= -1;
    //     }
    //     if (particles[i].y > this.y && this.y > this.radius) {
    //       this.y -= 1;
    //       this.dirY *= -1;
    //     }
    //   }
    // }
    this.x += this.dirX;
    this.y += this.dirY;
  }
}
function init() {
  particles = [];
  for (let i = 0; i < numOfParticles; i++) {
    let radius = Math.random() * (10 - 5) + 5;
    let newParticle = new particle(
      Math.random() * (canvas.width - 2 * radius) + radius,
      Math.random() * (canvas.height - 2 * radius) + radius,
      radius,
      Math.random() * (2 * maxParticleSpeed) - maxParticleSpeed,
      Math.random() * (2 * maxParticleSpeed) - maxParticleSpeed
    );
    particles.push(newParticle);
  }
}

function startAnimation() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (let i = 0; i < numOfParticles; i++) {
    particles[i].update();
    particles[i].draw();
  }

  for (let i = 0; i < numOfParticles; i++) {
    for (let j = 0; j < numOfParticles; j++) {
      let X = Math.abs(particles[i].x - particles[j].x);
      let Y = Math.abs(particles[i].y - particles[j].y);
      let distance = Math.sqrt(X * X + Y * Y);
      let lineOpacity = 1 - distance / lineOpacityDevider;
      if (
        distance <=
        canvas.width / lineDistanceDevider + canvas.height / lineDistanceDevider
      ) {
        ctx.strokeStyle = lineColor + lineOpacity + ")";
        ctx.lineWidth = particlesLineWidth;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(startAnimation);
}

init();
startAnimation();

window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  init();
});

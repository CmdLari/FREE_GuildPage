const canvas = document.getElementById("wind-canvas");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const particles = [];
const COUNT = 80;

function makeParticle() {
  const big = Math.random() < 0.15;       // ~15% big leaves
  const solid = Math.random() < 0.5;     // ~50% almost opaque

  return {
    x: Math.random() * w,
    y: Math.random() * h,

    // Base drift (wind)
    vx: 0.6 + Math.random() * 1.2,
    vy: 0.15 + Math.random() * 0.35,

    size: big
      ? 14 + Math.random() * 10   // big leaves
      : 4 + Math.random() * 8,    // normal leaves

    rot: Math.random() * Math.PI * 2,
    spin: (-0.03 + Math.random() * 0.06),

    wobble: Math.random() * 10,
    wobbleSpeed: 0.03 + Math.random() * 0.05,

    alpha: solid
      ? 0.85 + Math.random() * 0.1   // almost opaque
      : 0.25 + Math.random() * 0.2   // airy
  };
}

for (let i = 0; i < COUNT; i++) {
  particles.push(makeParticle());
}

function drawLeaf(ctx, x, y, size, rot, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  // Glow setup
  ctx.shadowColor = "rgba(190,238,233,0.8)";
  ctx.shadowBlur = size * 0.8; // glow strength scales with leaf size

  ctx.fillStyle = `rgba(190,238,233,${alpha})`;

  // Leaf silhouette
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.7);
  ctx.bezierCurveTo(size * 0.8, -size * 0.2, size * 0.7, size * 0.55, 0, size * 0.75);
  ctx.bezierCurveTo(-size * 0.7, size * 0.55, -size * 0.8, -size * 0.2, 0, -size * 0.7);
  ctx.closePath();
  ctx.fill();

  // Vein (slightly less glow)
  ctx.shadowBlur = size * 0.4;
  ctx.strokeStyle = `rgba(190,238,233,${alpha * 0.6})`;
  ctx.lineWidth = Math.max(0.8, size * 0.08);
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.62);
  ctx.lineTo(0, size * 0.62);
  ctx.stroke();

  ctx.restore();
}

let t = 0;

function update() {
  ctx.clearRect(0, 0, w, h);

  // Gentle gust factor
  t += 0.01;
  const gust = 0.8 + Math.sin(t) * 0.55;

  for (const p of particles) {
    const speedFactor = p.size > 12 ? 0.8 : 1;

    // Motion
    p.x += p.vx * gust * speedFactor;
    p.y += p.vy;

    // Flutter + rotation
    p.rot += p.spin;
    p.wobble += p.wobbleSpeed;
    p.x += Math.sin(p.wobble) * 0.5;

    // Respawn
    if (p.x > w + 30 || p.y > h + 30) {
      Object.assign(p, makeParticle(), {
        x: -30,
        y: Math.random() * h
      });
    }

    drawLeaf(ctx, p.x, p.y, p.size, p.rot, p.alpha);
  }

  requestAnimationFrame(update);
}

update();

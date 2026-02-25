(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const DPR = Math.max(1, Math.floor(window.devicePixelRatio || 1));

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  // play rect = full canvas area (slight padding so overlay looks nice)
  function playRect() {
    const W = canvas.clientWidth, H = canvas.clientHeight;
    const pad = Math.max(14, Math.min(22, Math.floor(W * 0.03)));
    return { x: pad, y: pad, w: W - pad*2, h: H - pad*2 };
  }

  // ===== Game state =====
  let running = false;
  let dead = false;
  let score = 0;
  let best = Number(localStorage.getItem("flappy_best") || 0);

  const bird = { x: 0, y: 0, r: 12, vy: 0 };
  let pipes = [];
  let lastTs = 0;
  let spawnT = 0;

  const GRAVITY = 0.42;
  const FLAP = -7.8;
  const PIPE_SPEED = 2.6;
  const PIPE_W = 64;
  const PIPE_GAP = 150;
  const SPAWN_MS = 1400;

  // fluffy clouds (same style vibe as CSS)
  const clouds = Array.from({ length: 9 }).map(() => ({
    x: Math.random(),
    y: Math.random(),
    s: 0.65 + Math.random() * 1.1,
    v: 0.010 + Math.random() * 0.020,
  }));

  function reset() {
    const p = playRect();
    running = false;
    dead = false;
    score = 0;

    bird.x = p.x + p.w * 0.26;
    bird.y = p.y + p.h * 0.45;
    bird.vy = 0;

    pipes = [];
    lastTs = 0;
    spawnT = 0;
  }

  function spawnPipe(p) {
    const margin = 70;
    const minGapY = p.y + margin + PIPE_GAP / 2;
    const maxGapY = p.y + p.h - margin - PIPE_GAP / 2;
    const gapY = minGapY + Math.random() * (maxGapY - minGapY);

    pipes.push({ x: p.x + p.w + 20, gapY, passed: false });
  }

  function flap() {
    if (!running) running = true;
    if (dead) { reset(); running = true; }
    bird.vy = FLAP;
  }

  function circleRectCollide(cx, cy, r, rx, ry, rw, rh) {
    const closestX = Math.max(rx, Math.min(cx, rx + rw));
    const closestY = Math.max(ry, Math.min(cy, ry + rh));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return dx * dx + dy * dy <= r * r;
  }

  // drawing helpers
  function roundRect(x, y, w, h, r) {
    const rr = Math.min(r, w/2, h/2);
    ctx.beginPath();
    ctx.moveTo(x+rr, y);
    ctx.arcTo(x+w, y, x+w, y+h, rr);
    ctx.arcTo(x+w, y+h, x, y+h, rr);
    ctx.arcTo(x, y+h, x, y, rr);
    ctx.arcTo(x, y, x+w, y, rr);
    ctx.closePath();
  }

  function drawCloud(px, py, s, alpha=0.90) {
    ctx.save();
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    const r = 22 * s;

    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.arc(px + r * 1.05, py + 6 * s, r * 0.85, 0, Math.PI * 2);
    ctx.arc(px - r * 1.05, py + 7 * s, r * 0.78, 0, Math.PI * 2);
    ctx.arc(px, py + 12 * s, r * 0.95, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawBackground(p) {
    // soft sky gradient
    const g = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight);
    g.addColorStop(0, "#e9fbf4");
    g.addColorStop(1, "#d6f2e8");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // clouds (inside canvas)
    const t = performance.now() / 1000;
    clouds.forEach((c, i) => {
      const px = p.x + ((c.x + t * c.v) % 1) * p.w;
      const py = p.y + (0.10 + c.y * 0.35) * p.h + Math.sin(t * 0.7 + i) * 1.5;
      drawCloud(px, py, c.s, 0.88);
    });
  }

  function drawWorld(p) {
    // rounded play clipping (nice edges, still no board)
    ctx.save();
    roundRect(p.x, p.y, p.w, p.h, 18);
    ctx.clip();

    // ground
    const groundH = 56;
    const groundY = p.y + p.h - groundH;
    ctx.fillStyle = "rgba(155,211,183,0.95)";
    ctx.fillRect(p.x, groundY, p.w, groundH);

    // tiny flowers pixels
    for (let i = 0; i < 90; i++) {
      const x = p.x + (i * 19) % p.w;
      const y = groundY + 10 + ((i * 11) % 32);
      ctx.fillStyle = i % 3 === 0 ? "rgba(255,255,255,0.9)"
        : (i % 3 === 1 ? "rgba(255,209,230,0.9)" : "rgba(255,242,166,0.9)");
      ctx.fillRect(x, y, 3, 3);
    }

    // pipes
    for (const pipe of pipes) {
      const topH = (pipe.gapY - PIPE_GAP / 2) - p.y;
      const botY = pipe.gapY + PIPE_GAP / 2;

      ctx.fillStyle = "#3aa675";
      ctx.fillRect(pipe.x, p.y, PIPE_W, topH);
      ctx.fillRect(pipe.x, botY, PIPE_W, (p.y + p.h) - botY);

      ctx.fillStyle = "#2e8b63";
      ctx.fillRect(pipe.x - 6, p.y + topH - 16, PIPE_W + 12, 16);
      ctx.fillRect(pipe.x - 6, botY, PIPE_W + 12, 16);

      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(pipe.x + 10, p.y, 8, topH);
      ctx.fillRect(pipe.x + 10, botY, 8, (p.y + p.h) - botY);
    }

    // bird
    ctx.fillStyle = "#f1a9a1";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(0,0,0,0.22)";
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.fillRect(bird.x + 3, bird.y - 7, 8, 8);
    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(bird.x + 7, bird.y - 5, 3, 3);

    ctx.fillStyle = "#ffd1a1";
    ctx.fillRect(bird.x + 12, bird.y - 1, 10, 6);
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.strokeRect(bird.x + 12, bird.y - 1, 10, 6);

    // score
    ctx.font = "16px 'Press Start 2P', monospace";
    ctx.fillStyle = "rgba(43,43,43,0.70)";
    ctx.fillText(String(score), p.x + 16, p.y + 32);

    ctx.restore();

    // subtle inner outline (no board, just a thin line)
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1;
    roundRect(p.x, p.y, p.w, p.h, 18);
    ctx.stroke();
  }

  function drawOverlay(p) {
    const boxW = Math.min(520, p.w * 0.78);
    const boxH = 230;
    const bx = p.x + (p.w - boxW) / 2;
    const by = p.y + (p.h - boxH) / 2 - 10;

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.10)";
    ctx.shadowBlur = 26;
    ctx.shadowOffsetY = 14;
    ctx.fillStyle = "rgba(246,251,248,0.92)";
    roundRect(bx, by, boxW, boxH, 16);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1;
    roundRect(bx, by, boxW, boxH, 16);
    ctx.stroke();

    ctx.font = "16px 'Press Start 2P', monospace";
    ctx.fillStyle = "rgba(43,43,43,0.78)";
    ctx.fillText(dead ? "Game Over!" : "Flappy Lizi", bx + 26, by + 46);

    ctx.font = "600 13px Inter, system-ui";
    ctx.fillStyle = "rgba(43,43,43,0.62)";
    ctx.fillText(dead ? "Press SPACE or CLICK to retry" : "Press SPACE or CLICK to play", bx + 26, by + 72);

    // score row
    const rowX = bx + 22, rowY = by + 92, rowW = boxW - 44, rowH = 44;
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.strokeStyle = "rgba(0,0,0,0.10)";
    roundRect(rowX, rowY, rowW, rowH, 12);
    ctx.fill(); ctx.stroke();

    ctx.font = "600 12px Inter, system-ui";
    ctx.fillStyle = "rgba(43,43,43,0.55)";
    ctx.fillText("Your score", rowX + 14, rowY + 27);

    ctx.font = "16px 'Press Start 2P', monospace";
    ctx.fillStyle = "rgba(46,139,99,0.95)";
    ctx.fillText(String(score), rowX + rowW - 44, rowY + 32);

    // button
    const btnY = rowY + 60, btnH = 44;
    ctx.fillStyle = "rgba(46,139,99,0.16)";
    ctx.strokeStyle = "rgba(46,139,99,0.28)";
    roundRect(rowX, btnY, rowW, btnH, 12);
    ctx.fill(); ctx.stroke();

    ctx.font = "700 14px Inter, system-ui";
    ctx.fillStyle = "rgba(46,139,99,0.95)";
    const t = dead ? "Retry" : "Play";
    const tw = ctx.measureText(t).width;
    ctx.fillText(t, rowX + (rowW - tw) / 2, btnY + 28);

    ctx.font = "600 12px Inter, system-ui";
    ctx.fillStyle = "rgba(43,43,43,0.50)";
    const note = `Best: ${best}`;
    ctx.fillText(note, rowX + (rowW - ctx.measureText(note).width) / 2, btnY + 70);
  }

  function update(dt, p) {
    const dtSec = dt / 1000;

    // bird physics
    bird.vy += GRAVITY * (dtSec * 60);
    bird.y += bird.vy * (dtSec * 60);

    // bounds
    const groundH = 56;
    const groundY = p.y + p.h - groundH;
    if (bird.y + bird.r > groundY) {
      bird.y = groundY - bird.r;
      dead = true;
      running = false;
      return;
    }
    if (bird.y - bird.r < p.y) {
      bird.y = p.y + bird.r;
      bird.vy = 0;
    }

    // pipes
    for (const pipe of pipes) {
      pipe.x -= PIPE_SPEED * (dtSec * 60);

      if (!pipe.passed && pipe.x + PIPE_W < bird.x - bird.r) {
        pipe.passed = true;
        score += 1;
        if (score > best) {
          best = score;
          localStorage.setItem("flappy_best", String(best));
        }
      }

      const topH = (pipe.gapY - PIPE_GAP / 2) - p.y;
      const botY = pipe.gapY + PIPE_GAP / 2;
      const botH = (p.y + p.h) - botY;

      if (circleRectCollide(bird.x, bird.y, bird.r, pipe.x, p.y, PIPE_W, topH)) {
        dead = true; running = false; return;
      }
      if (circleRectCollide(bird.x, bird.y, bird.r, pipe.x, botY, PIPE_W, botH)) {
        dead = true; running = false; return;
      }
    }

    pipes = pipes.filter(pipe => pipe.x > p.x - PIPE_W - 50);

    // spawn
    spawnT += dt;
    if (spawnT >= SPAWN_MS) {
      spawnT = 0;
      spawnPipe(p);
    }
  }

  function loop(ts) {
    if (!lastTs) lastTs = ts;
    const dt = Math.min(40, ts - lastTs);
    lastTs = ts;

    const p = playRect();

    drawBackground(p);
    drawWorld(p);

    if (running && !dead) update(dt, p);
    if (!running || dead) drawOverlay(p);

    requestAnimationFrame(loop);
  }

  // input
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      flap();
    }
  }, { passive:false });

  canvas.addEventListener("mousedown", () => flap());

  reset();
  requestAnimationFrame(loop);
})();

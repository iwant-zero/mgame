const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 화면 크기 자동 조정
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// 플레이어
let player = { x: 100, y: 300, w: 64, h: 64, vy: 0, hp: 100 };

// 몬스터
let slimes = [
  { x: 400, y: 300, w: 64, h: 64, hp: 30 }
];

let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function jump() {
  if (player.vy === 0) {
    player.vy = -12;
  }
}

function update() {
  // 중력
  player.vy += 0.5;
  player.y += player.vy;

  if (player.y > canvas.height - player.h) {
    player.y = canvas.height - player.h;
    player.vy = 0;
  }

  if (keys["ArrowLeft"]) player.x -= 5;
  if (keys["ArrowRight"]) player.x += 5;
  if (keys["ArrowUp"]) jump();

  // 몬스터 충돌 체크
  slimes.forEach(slime => {
    if (player.x < slime.x + slime.w &&
        player.x + player.w > slime.x &&
        player.y < slime.y + slime.h &&
        player.y + player.h > slime.y) {
      slime.hp -= 1;
    }
  });

  // 몬스터 제거
  slimes = slimes.filter(s => s.hp > 0);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 플레이어 (빨간 네모)
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // 몬스터 (초록 네모)
  ctx.fillStyle = "lime";
  slimes.forEach(slime => ctx.fillRect(slime.x, slime.y, slime.w, slime.h));

  // HUD
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("HP: " + player.hp, 20, 30);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

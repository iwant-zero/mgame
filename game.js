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
const playerImg = new Image();
playerImg.src = "assets/player_sheet.png";

let player = { x: 100, y: 300, w: 64, h: 64, vy: 0, hp: 100 };

// 몬스터
const slimeImg = new Image();
slimeImg.src = "assets/slime_sheet.png";

let slimes = [
  { x: 400, y: 300, w: 64, h: 64, hp: 30 }
];

// 효과음
const hitSound = new Audio("assets/sfx_hit.mp3");

let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

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
  if (keys["ArrowUp"] && player.vy === 0) player.vy = -12;

  // 몬스터 충돌 체크
  slimes.forEach(slime => {
    if (player.x < slime.x + slime.w &&
        player.x + player.w > slime.x &&
        player.y < slime.y + slime.h &&
        player.y + player.h > slime.y) {
      slime.hp -= 1;
      hitSound.play();
    }
  });

  // 몬스터 제거
  slimes = slimes.filter(s => s.hp > 0);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 플레이어
  ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);

  // 몬스터
  slimes.forEach(slime => {
    ctx.drawImage(slimeImg, slime.x, slime.y, slime.w, slime.h);
  });

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

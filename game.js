const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 설정값
const CARD_W = 60;
const CARD_H = 90;
const PADDING = 10;

let gameState = {
    deck: [],
    opponentHand: [], // 상대방 패
    myHand: [],       // 내 패
    floorCards: [],   // 바닥 패
    turn: 'player'
};

function init() {
    window.addEventListener('resize', resize);
    resize();
    setupGame();
    animate();
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
}

// 1. 게임 셋팅 (패 섞기 및 분배)
function setupGame() {
    // 12달 x 4장 = 48장 생성
    let tempDeck = [];
    for (let m = 1; m <= 12; m++) {
        for (let i = 0; i < 4; i++) {
            tempDeck.push({ month: m, id: i });
        }
    }
    // 셔플
    gameState.deck = tempDeck.sort(() => Math.random() - 0.5);

    // 신맞고 기본 분배: 상대 10장, 나 10장, 바닥 8장
    gameState.opponentHand = gameState.deck.splice(0, 10);
    gameState.myHand = gameState.deck.splice(0, 10);
    gameState.floorCards = gameState.deck.splice(0, 8);
}

// 2. 그리기 로직 (상/중/하 배치)
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // [상단] 상대방 패 (뒷면 처리)
    gameState.opponentHand.forEach((card, i) => {
        drawCard(centerX - (5 * (CARD_W/2)) + (i * 30), 50, "B", false);
    });

    // [중앙] 바닥 패 (2줄 배열)
    gameState.floorCards.forEach((card, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        drawCard(centerX - (2 * CARD_W) + (col * (CARD_W + 10)), centerY - 50 + (row * (CARD_H + 10)), card.month, true);
    });

    // [하단] 내 패
    gameState.myHand.forEach((card, i) => {
        const startX = centerX - (5 * (CARD_W + 5));
        drawCard(startX + (i * (CARD_W + 5)), canvas.height - 130, card.month, true, true);
    });

    // 중앙 덱 (남은 패)
    if(gameState.deck.length > 0) {
        drawCard(centerX + 150, centerY - 45, "Deck", false);
    }
}

// 카드 그리기 공통 함수
function drawCard(x, y, label, isFaceUp, isMine = false) {
    // 카드 그림자 및 몸체
    ctx.fillStyle = isFaceUp ? "#fff" : "#c62828"; // 앞면 흰색, 뒷면 빨간색
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    
    // 라운드 사각형 효과
    roundRect(ctx, x, y, CARD_W, CARD_H, 5, true, true);

    if (isFaceUp) {
        ctx.fillStyle = "#000";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(label + "월", x + CARD_W/2, y + CARD_H/2 + 7);
        
        // 내 패일 경우 '푸른 마력의 잔상' 테두리 효과
        if (isMine) {
            ctx.strokeStyle = "cyan";
            ctx.lineWidth = 3;
            ctx.strokeRect(x - 2, y - 2, CARD_W + 4, CARD_H + 4);
        }
    } else {
        // 뒷면 무늬 (간단히)
        ctx.strokeStyle = "#ffffff55";
        ctx.strokeRect(x + 5, y + 5, CARD_W - 10, CARD_H - 10);
    }
}

// 캔버스 라운드 사각형 유틸리티
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}

function animate() {
    render();
    requestAnimationFrame(animate);
}

// 클릭 이벤트 - 내 패 내기
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const startX = centerX - (5 * (CARD_W + 5));

    if (y > canvas.height - 130) {
        const idx = Math.floor((x - startX) / (CARD_W + 5));
        if (idx >= 0 && idx < gameState.myHand.length) {
            const played = gameState.myHand.splice(idx, 1)[0];
            // 바닥 패로 이동 로직 (간소화)
            gameState.floorCards.push(played);
            console.log(played.month + "월을 냈습니다.");
        }
    }
});

init();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 화면 크기 조정 함수
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// 게임 상태 변수
const gameState = {
    myHand: [],
    floorCards: [],
    score: 0,
    cardWidth: 60,
    cardHeight: 90
};

// 1. 카드 초기화 (48장)
function initDeck() {
    let deck = [];
    for (let i = 1; i <= 12; i++) {
        for (let j = 0; j < 4; j++) {
            deck.push({ month: i, id: j });
        }
    }
    return deck.sort(() => Math.random() - 0.5);
}

// 2. 게임 시작 (패 돌리기)
function startGame() {
    const deck = initDeck();
    gameState.myHand = deck.splice(0, 10); // 내 패 10장
    gameState.floorCards = deck.splice(0, 8); // 바닥 패 8장
    render();
}

// 3. 화면 그리기
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 바닥 패 그리기
    gameState.floorCards.forEach((card, i) => {
        drawCard(card, 50 + (i * (gameState.cardWidth + 10)), canvas.height / 2 - 45, "floor");
    });

    // 내 패 그리기
    gameState.myHand.forEach((card, i) => {
        drawCard(card, 50 + (i * (gameState.cardWidth + 5)), canvas.height - 120, "hand");
    });
}

// 카드 그리기 함수 (이미지 대신 색상/숫자로 표현)
function drawCard(card, x, y, type) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, gameState.cardWidth, gameState.cardHeight);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(x, y, gameState.cardWidth, gameState.cardHeight);
    
    ctx.fillStyle = card.month % 2 === 0 ? "red" : "black";
    ctx.font = "20px Arial";
    ctx.fillText(card.month, x + 15, y + 30);
    
    // 푸른 마력의 잔상 이펙트 (특수 효과 예시)
    if (type === "hand") {
        ctx.strokeStyle = "rgba(0, 150, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x-2, y-2, gameState.cardWidth+4, gameState.cardHeight+4);
    }
}

// 4. 클릭 이벤트 (패 내기)
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 내 패 클릭 감지
    if (mouseY > canvas.height - 120) {
        const clickedIndex = Math.floor((mouseX - 50) / (gameState.cardWidth + 5));
        if (clickedIndex >= 0 && clickedIndex < gameState.myHand.length) {
            playTurn(clickedIndex);
        }
    }
});

function playTurn(index) {
    const card = gameState.myHand.splice(index, 1)[index];
    // 여기에 바닥 패와 매칭 로직 및 '푸른 마력의 잔상' 이펙트 추가 가능
    gameState.score += 10;
    document.getElementById('my-score').innerText = gameState.score;
    render();
}

startGame();

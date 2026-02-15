const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let deck = [];
let playerHand = [];
let dealerHand = [];

// 화면 크기 반응형 대응
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
}
window.addEventListener('resize', resize);

// 카드 덱 생성
function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let newDeck = [];
    for (let s of suits) {
        for (let r of ranks) {
            newDeck.push({ suit: s, rank: r, color: (s === '♥' || s === '♦') ? '#e53935' : '#212121' });
        }
    }
    return newDeck.sort(() => Math.random() - 0.5);
}

// 게임 시작
function startGame() {
    deck = createDeck();
    playerHand = deck.splice(0, 7); // 7장 분배
    dealerHand = deck.splice(0, 7);
    render();
}

// 카드 그리기 (도형 렌더링)
function drawCard(card, x, y, isHidden = false) {
    const w = 60;
    const h = 85;

    // 카드 그림자
    ctx.shadowBlur = 5;
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    
    // 카드 몸체
    ctx.fillStyle = isHidden ? "#c62828" : "white";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();
    ctx.shadowBlur = 0; // 그림자 초기화

    if (!isHidden) {
        ctx.fillStyle = card.color;
        ctx.font = "bold 16px Arial";
        ctx.fillText(card.suit, x + 5, y + 20);
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(card.rank, x + w/2, y + h/2 + 7);
    } else {
        // 카드 뒷면 무늬
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 5, y + 5, w - 10, h - 10);
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;

    // 딜러 패 (상단)
    dealerHand.forEach((card, i) => {
        // 처음 2장과 마지막 1장은 숨김 (포커 룰 적용 예시)
        const hidden = (i < 2 || i === 6);
        drawCard(card, (centerX - 210) + (i * 65), 80, hidden);
    });

    // 플레이어 패 (하단)
    playerHand.forEach((card, i) => {
        drawCard(card, (centerX - 210) + (i * 65), canvas.height - 200, false);
    });

    // 텍스트 안내
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("DEALER", centerX, 60);
    ctx.fillText("PLAYER", centerX, canvas.height - 220);
}

resize(); // 초기 실행

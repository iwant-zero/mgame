const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let deck = [];
let playerHand = [];
let dealerHand = [];
const CARD_W = 60;
const CARD_H = 85;
const SPACING = 65;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
}
window.addEventListener('resize', resize);

// 1. 덱 생성 및 초기화
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

// 2. 게임 시작
function startGame() {
    deck = createDeck();
    playerHand = deck.splice(0, 7); 
    dealerHand = deck.splice(0, 7);
    document.getElementById('msg').innerText = "교체할 카드를 클릭하세요!";
    render();
}

// 3. 카드 교체 로직 (클릭 이벤트)
canvas.addEventListener('mousedown', (e) => {
    if (playerHand.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const startX = centerX - 210;
    const startY = canvas.height - 200;

    // 플레이어 카드 영역 클릭 감지
    playerHand.forEach((card, i) => {
        const cardX = startX + (i * SPACING);
        if (mouseX >= cardX && mouseX <= cardX + CARD_W &&
            mouseY >= startY && mouseY <= startY + CARD_H) {
            
            swapCard(i); // i번째 카드 교체
        }
    });
});

function swapCard(index) {
    if (deck.length > 0) {
        // 1. 기존 카드 버리기 (콘솔 확인용)
        console.log(`${playerHand[index].rank} 카드를 버립니다.`);
        
        // 2. 덱에서 새 카드 한 장 뽑아서 교체
        playerHand[index] = deck.splice(0, 1)[0];
        
        // 3. 안내 메시지 변경 및 리렌더링
        document.getElementById('msg').innerText = "카드가 교체되었습니다!";
        render();
    } else {
        document.getElementById('msg').innerText = "남은 카드가 없습니다.";
    }
}

// 4. 화면 그리기
function drawCard(card, x, y, isHidden = false) {
    ctx.fillStyle = isHidden ? "#c62828" : "white";
    ctx.beginPath();
    ctx.roundRect(x, y, CARD_W, CARD_H, 8);
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.stroke();

    if (!isHidden) {
        ctx.fillStyle = card.color;
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "left";
        ctx.fillText(card.suit, x + 5, y + 20);
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(card.rank, x + CARD_W/2, y + CARD_H/2 + 7);
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;

    // 딜러 패 (상단)
    dealerHand.forEach((card, i) => {
        const hidden = (i < 2 || i === 6);
        drawCard(card, (centerX - 210) + (i * SPACING), 80, hidden);
    });

    // 플레이어 패 (하단)
    playerHand.forEach((card, i) => {
        drawCard(card, (centerX - 210) + (i * SPACING), canvas.height - 200, false);
    });
}

resize();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let deck = [], playerHand = [], dealerHand = [];
const CARD_W = 65, CARD_H = 95, SPACING = 75;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
}
window.addEventListener('resize', resize);

// 1. 족보 판정 시스템
function getHandRank(hand) {
    const ranks = hand.map(c => "23456789TJQKA".indexOf(c.rank === '10' ? 'T' : c.rank));
    const suits = hand.map(c => c.suit);
    ranks.sort((a, b) => a - b);

    const counts = {};
    ranks.forEach(r => counts[r] = (counts[r] || 0) + 1);
    const valCounts = Object.values(counts).sort((a, b) => b - a);

    // 플러시 확인
    const isFlush = suits.some(s => suits.filter(x => x === s).length >= 5);
    
    // 스트레이트 확인
    let isStraight = false;
    let uniqueRanks = [...new Set(ranks)];
    for (let i = 0; i <= uniqueRanks.length - 5; i++) {
        if (uniqueRanks[i+4] - uniqueRanks[i] === 4) isStraight = true;
    }

    if (isFlush && isStraight) return "스트레이트 플러시";
    if (valCounts[0] === 4) return "포카드";
    if (valCounts[0] === 3 && valCounts[1] >= 2) return "풀하우스";
    if (isFlush) return "플러시";
    if (isStraight) return "스트레이트";
    if (valCounts[0] === 3) return "트리플";
    if (valCounts[0] === 2 && valCounts[1] === 2) return "투 페어";
    if (valCounts[0] === 2) return "원 페어";
    return "노 페어 (하이카드)";
}

// 2. 카드 생성 및 분배 (딜러 로직)
function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'], ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    let newDeck = [];
    for (let s of suits) for (let r of ranks) {
        newDeck.push({ suit: s, rank: r, color: (s === '♥' || s === '♦') ? '#e53935' : '#212121' });
    }
    return newDeck.sort(() => Math.random() - 0.5);
}

function startGame() {
    deck = createDeck();
    playerHand = []; dealerHand = [];
    // 딜러가 순차적으로 돌려주는 연출 (7장씩)
    for(let i=0; i<7; i++) {
        playerHand.push(deck.pop());
        dealerHand.push(deck.pop());
    }
    updateUI();
    render();
}

// 3. 교체 및 AI 자동화 로직
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const startX = (canvas.width / 2) - 250, startY = canvas.height - 180;

    playerHand.forEach((card, i) => {
        const cardX = startX + (i * SPACING);
        if (x >= cardX && x <= cardX + CARD_W && y >= startY && y <= startY + CARD_H) {
            playerSwap(i);
        }
    });
});

function playerSwap(index) {
    if (deck.length < 2) return;
    // 플레이어 교체
    playerHand[index] = deck.pop();
    
    // AI 자동 교체 로직 (가장 낮은 숫자나 족보에 도움 안되는 패 1장 교체)
    const aiIndex = Math.floor(Math.random() * 7);
    dealerHand[aiIndex] = deck.pop();

    document.getElementById('msg').innerText = "카드를 교체했습니다. AI도 교체 완료!";
    updateUI();
    render();
}

function updateUI() {
    const rank = getHandRank(playerHand);
    document.getElementById('hand-rank').innerText = `나의 족보: ${rank}`;
}

function drawCard(card, x, y, isHidden) {
    ctx.fillStyle = isHidden ? "#c62828" : "white";
    ctx.beginPath(); ctx.roundRect(x, y, CARD_W, CARD_H, 8); ctx.fill();
    ctx.strokeStyle = "#000"; ctx.stroke();
    if (!isHidden) {
        ctx.fillStyle = card.color; ctx.font = "bold 14px Arial";
        ctx.fillText(card.suit, x + 5, y + 18);
        ctx.font = "bold 18px Arial"; ctx.textAlign = "center";
        ctx.fillText(card.rank, x + CARD_W/2, y + CARD_H/2 + 5);
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    dealerHand.forEach((c, i) => drawCard(c, (centerX - 250) + (i * SPACING), 80, (i<2 || i===6)));
    playerHand.forEach((c, i) => drawCard(c, (centerX - 250) + (i * SPACING), canvas.height - 180, false));
    ctx.fillStyle = "white"; ctx.textAlign = "center";
    ctx.fillText("DEALER", centerX, 65);
    ctx.fillText("PLAYER", centerX, canvas.height - 200);
}

resize();

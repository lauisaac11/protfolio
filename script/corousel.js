const items = document.querySelectorAll('.item');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const container = document.querySelector('.container');

let currentIndex = 0;
let timer = null;

/**
 * 核心佈局函數：根據 currentIndex 計算所有圖片的 3D 屬性
 */
function layout() {
    const step = 150;      // 基礎間距
    const scaleStep = 0.8; // 縮放率
    const opacityStep = 0.6; // 透明度

    items.forEach((item, i) => {
        const dis = i - currentIndex; // 計算與中心點的距離
        const absDis = Math.abs(dis);

        // 1. 計算水平位移
        let tx = dis * step;
        if (dis > 0) tx += 80;
        if (dis < 0) tx -= 80;

        // 2. 計算縮放、透明度與 3D 旋轉
        const scale = Math.pow(scaleStep, absDis);
        const opacity = Math.pow(opacityStep, absDis);
        const rotateY = dis === 0 ? 0 : (dis > 0 ? -40 : 40);
        
        // 3. 計算層級 (z-index)
        const zIndex = items.length - absDis;

        // 應用樣式
        item.style.transform = `translateX(${tx}px) scale(${scale}) rotateY(${rotateY}deg)`;
        item.style.opacity = opacity;
        item.style.zIndex = zIndex;
        item.style.pointerEvents = dis === 0 ? 'auto' : 'none'; 
        
        // 中間以外的圖片稍微模糊
        item.style.filter = dis === 0 ? 'none' : 'blur(2px)';
    });
}

function moveToNext() {
    currentIndex++;
    if (currentIndex >= items.length) currentIndex = 0;
    layout();
}

function moveToPrev() {
    currentIndex--;
    if (currentIndex < 0) currentIndex = items.length - 1;
    layout();
}

/**
 * 重置自動輪播計時器
 * 當手動操作時呼叫，確保冷卻時間重新計算
 */
function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

// 定時器邏輯
function startAutoPlay() {
    if (timer) return; // 避免重複啟動多個計時器
    timer = setInterval(moveToNext, 3000);
}

function stopAutoPlay() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

// --- 綁定點擊事件 ---

// 下一張按鈕
nextBtn.onclick = (e) => {
    e.stopPropagation(); 
    e.preventDefault();
    moveToNext();
    resetAutoPlay(); // 手動操作後重置冷卻時間
};

// 上一張按鈕
prevBtn.onclick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    moveToPrev();
    resetAutoPlay(); // 手動操作後重置冷卻時間
};

// 圖片點擊
items.forEach((item, i) => {
    item.onclick = () => {
        currentIndex = i;
        layout();
        resetAutoPlay(); // 點擊特定圖片也重置冷卻時間
    };
});

// 滑鼠移入暫停，移出恢復
// 建議監聽容器或整個包圍層
container.onmouseenter = stopAutoPlay;
container.onmouseleave = startAutoPlay;

// 初始化執行
layout();
startAutoPlay();
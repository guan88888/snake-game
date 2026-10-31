// 游戏配置
const config = {
    gridSize: 20,      // 网格大小
    tileCount: 20,     // 网格数量
    initialSpeed: 200  // 初始速度(ms)
};

// 游戏状态
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameLoop = null;
let isGameRunning = false;

// 获取DOM元素
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');

// 初始化游戏
function initGame() {
    // 初始化蛇的位置
    snake = [
        {x: 6, y: 10},
        {x: 5, y: 10},
        {x: 4, y: 10}
    ];
    
    // 生成第一个食物
    generateFood();
    
    // 重置分数
    score = 0;
    updateScore();
    
    // 重置方向
    direction = 'right';
    nextDirection = 'right';
}

// 生成食物
function generateFood() {
    while (true) {
        food = {
            x: Math.floor(Math.random() * config.tileCount),
            y: Math.floor(Math.random() * config.tileCount)
        };
        
        // 确保食物不会生成在蛇身上
        let foodOnSnake = false;
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                foodOnSnake = true;
                break;
            }
        }
        
        if (!foodOnSnake) break;
    }
}

// 更新分数显示
function updateScore() {
    scoreElement.textContent = `分数: ${score}`;
}

// 游戏主循环
function gameStep() {
    // 更新蛇的方向
    direction = nextDirection;
    
    // 获取蛇头位置
    const head = {...snake[0]};
    
    // 根据方向移动蛇头
    switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // 检查游戏结束条件
    if (isGameOver(head)) {
        endGame();
        return;
    }
    
    // 将新的头部添加到蛇身数组的开头
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        generateFood();
    } else {
        // 如果没有吃到食物，删除尾部
        snake.pop();
    }
    
    // 绘制游戏画面
    draw();
}

// 检查游戏是否结束
function isGameOver(head) {
    // 检查是否撞墙
    if (head.x < 0 || head.x >= config.tileCount ||
        head.y < 0 || head.y >= config.tileCount) {
        return true;
    }
    
    // 检查是否撞到自己
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            return true;
        }
    }
    
    return false;
}

// 绘制游戏画面
function draw() {
    // 清空画布
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    for (let segment of snake) {
        ctx.fillRect(
            segment.x * config.gridSize,
            segment.y * config.gridSize,
            config.gridSize - 2,
            config.gridSize - 2
        );
    }
    
    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(
        food.x * config.gridSize,
        food.y * config.gridSize,
        config.gridSize - 2,
        config.gridSize - 2
    );
}

// 开始游戏
function startGame() {
    if (isGameRunning) return;
    
    initGame();
    isGameRunning = true;
    startBtn.textContent = '重新开始';
    gameLoop = setInterval(gameStep, config.initialSpeed);
}

// 结束游戏
function endGame() {
    isGameRunning = false;
    clearInterval(gameLoop);
    alert(`游戏结束！最终得分：${score}`);
    startBtn.textContent = '开始游戏';
}

// 键盘事件处理
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
});

// 开始按钮事件监听
startBtn.addEventListener('click', startGame);
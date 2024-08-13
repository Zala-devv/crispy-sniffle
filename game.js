const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.5;
let gameObjects = [];

class GameObject {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.dy = 0; // Vertical velocity
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        if (this.y + this.height + this.dy > canvas.height) {
            this.dy = 0;
            this.y = canvas.height - this.height;
        } else {
            this.dy += gravity;
            this.y += this.dy;
        }
        this.draw();
    }
}

class Player extends GameObject {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
        this.dx = 0; // Horizontal velocity
    }

    update() {
        this.x += this.dx;
        if (this.x + this.width > canvas.width || this.x < 0) {
            this.dx = 0;
        }
        super.update();
    }
}

const player = new Player(50, 50, 50, 50, 'red');
gameObjects.push(player);

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') {
        player.dx = 5;
    } else if (e.code === 'ArrowLeft') {
        player.dx = -5;
    } else if (e.code === 'ArrowUp' && player.dy === 0) {
        player.dy = -10;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
        player.dx = 0;
    }
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameObjects.forEach(object => object.update());
    requestAnimationFrame(gameLoop);
}

gameLoop();

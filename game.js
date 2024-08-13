const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.5;
const playerSpeed = 5;
const jumpStrength = -10; // Negative value to move up
const platformWidth = 200;
const platformHeight = 20;
let keys = {};
let gameObjects = [];
let platforms = [];
let scrollOffset = 0;

class GameObject {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.dy = 0; // Vertical velocity
        this.dx = 0; // Horizontal velocity
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.draw();
    }
}

class Player extends GameObject {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
        this.dy = 0;  // Start without initial upward motion
        this.isOnPlatform = false;  // Track whether the player is on a platform
    }

    update() {
        this.dx = 0;

        // Handle horizontal movement
        if (keys['ArrowRight']) {
            this.dx = playerSpeed;
        } 
        if (keys['ArrowLeft']) {
            this.dx = -playerSpeed;
        }

        // Jump movement
        if (keys['ArrowUp']) {
            this.dy = jumpStrength;
            this.isOnPlatform = false; // Player is no longer on the platform after jumping
        }

        // Apply movement
        this.x += this.dx;
        this.y += this.dy;

        // Apply gravity
        this.dy += gravity;

        // Ensure the player stays within the canvas horizontally
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        } else if (this.x < 0) {
            this.x = 0;
        }

        this.isOnPlatform = false; // Reset before collision detection

        super.update();
    }
}

class Platform extends GameObject {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
    }

    update() {
        // Remove platforms that go off the screen
        if (this.y > canvas.height) {
            platforms = platforms.filter(p => p !== this);
        }

        super.update();
    }
}

// Initialize player directly above the bottom platform
const player = new Player(canvas.width / 2 - 25, canvas.height - 60 - platformHeight, 50, 50, 'red');
gameObjects.push(player);

// Create a starting platform at the very bottom edge of the canvas
function createBottomPlatform() {
    const platform = new Platform(canvas.width / 2 - platformWidth / 2, canvas.height - platformHeight, platformWidth, platformHeight, 'green');
    platforms.push(platform);
}

// Create the bottom platform
createBottomPlatform();

// Generate initial platforms above the bottom platform
for (let i = 1; i < 5; i++) {
    createPlatform(Math.random() * (canvas.width - platformWidth), canvas.height - 100 - i * 150);
}

// Function to create additional platforms
function createPlatform(x, y) {
    const platform = new Platform(x, y, platformWidth, platformHeight, 'green');
    platforms.push(platform);
}

// Key event listeners
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move platforms down and generate new ones
    if (platforms[platforms.length - 1].y > 0) {
        createPlatform(Math.random() * (canvas.width - platformWidth), -platformHeight);
    }

    // Update and draw all game objects
    platforms.forEach(platform => platform.update());
    gameObjects.forEach(object => object.update());

    // Collision detection with platforms
    platforms.forEach(platform => {
        if (
            player.y + player.height >= platform.y &&
            player.y + player.height <= platform.y + platformHeight &&
            player.x + player.width >= platform.x &&
            player.x <= platform.x + platformWidth
        ) {
            player.dy = 0;
            player.isOnPlatform = true;  // Mark the player as standing on a platform
            player.y = platform.y - player.height;  // Adjust player position to sit on the platform
        }
    });

    requestAnimationFrame(gameLoop);
}

gameLoop();

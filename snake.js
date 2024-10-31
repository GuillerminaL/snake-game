// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define the size of each box in the grid
const box = 20;

// Initialize the snake with one segment
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

// Define the obstacles
let obstacles = [
    { x: 5 * box, y: 5 * box },
    { x: 10 * box, y: 5 * box },
    { x: 15 * box, y: 5 * box },
    { x: 5 * box, y: 15 * box },
    { x: 10 * box, y: 15 * box },
    { x: 15 * box, y: 15 * box }
];

// Initialize the score and direction
let score = 0;
let d;

// Generate the initial food position
let food = generateFoodPosition();

// Listen for keydown events to change the direction
document.addEventListener('keydown', direction);

function direction(event) {
    if (event.keyCode == 37 && d != 'RIGHT') {
        d = 'LEFT';
    } else if (event.keyCode == 38 && d != 'DOWN') {
        d = 'UP';
    } else if (event.keyCode == 39 && d != 'LEFT') {
        d = 'RIGHT';
    } else if (event.keyCode == 40 && d != 'UP') {
        d = 'DOWN';
    }
}

// Check for collision with the snake itself or obstacles
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// Generate a new food position that does not overlap with the snake or obstacles
function generateFoodPosition() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } while (collision(newFood, snake) || collision(newFood, obstacles));
    return newFood;
}

// Draw the game elements on the canvas
function draw() {
    // Clear the canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = 'green';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Draw the obstacles
    ctx.fillStyle = 'grey';
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillRect(obstacles[i].x, obstacles[i].y, box, box);
    }

    // Get the current head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Update the head position based on the direction
    if (d == 'LEFT') snakeX -= box;
    if (d == 'UP') snakeY -= box;
    if (d == 'RIGHT') snakeX += box;
    if (d == 'DOWN') snakeY += box;

    // Wrap the snake position around the canvas
    if (snakeX < 0) snakeX = canvas.width - box;
    if (snakeY < 0) snakeY = canvas.height - box;
    if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY >= canvas.height) snakeY = 0;

    // Check if the snake eats the food
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = generateFoodPosition();
    } else {
        // Remove the tail if no food is eaten
        snake.pop();
    }

    // Create the new head position
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // Check for collisions with the snake itself or obstacles
    if (collision(newHead, snake) || collision(newHead, obstacles)) {
        clearInterval(game);
        document.getElementById('gameOver').style.display = 'block';
        return;
    }

    // Add the new head to the snake
    snake.unshift(newHead);

    // Draw the score on the canvas with some padding from the border
    ctx.fillStyle = 'white';
    ctx.font = '45px Changa one';
    ctx.fillText(score, box, 2 * box);
}

// Start the game
function startGame() {
    // Reset the game state
    snake = [{ x: 9 * box, y: 10 * box }];
    score = 0;
    d = null;
    food = generateFoodPosition();
    document.getElementById('gameOver').style.display = 'none';
    game = setInterval(draw, 100);
}

// Call the draw function every 100 milliseconds
let game = setInterval(draw, 100);
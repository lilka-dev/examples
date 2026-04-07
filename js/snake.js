// snake.js — Classic Snake game
// D-pad to move, A to exit.

let w = display.width;
let h = display.height;
let grid = 10;
let cols = math.floor(w / grid);
let rows = math.floor(h / grid);

// Snake body: arrays of grid positions
let snakeX = [math.floor(cols / 2)];
let snakeY = [math.floor(rows / 2)];
let dx = 1;
let dy = 0;
let length = 5;

// Food
let foodX = math.random(cols);
let foodY = math.random(rows);

let score = 0;
let gameOver = false;
let running = true;

while (running) {
    let ctrl = controller.get_state();
    if (ctrl.a.just_pressed) {
        running = false;
    }

    if (!gameOver) {
        // Input (prevent reversing)
        if (ctrl.up.just_pressed && dy !== 1) { dx = 0; dy = -1; }
        if (ctrl.down.just_pressed && dy !== -1) { dx = 0; dy = 1; }
        if (ctrl.left.just_pressed && dx !== 1) { dx = -1; dy = 0; }
        if (ctrl.right.just_pressed && dx !== -1) { dx = 1; dy = 0; }

        // Move head
        let newX = snakeX[0] + dx;
        let newY = snakeY[0] + dy;

        // Wrap around
        if (newX < 0) newX = cols - 1;
        if (newX >= cols) newX = 0;
        if (newY < 0) newY = rows - 1;
        if (newY >= rows) newY = 0;

        // Self collision
        for (let i = 0; i < snakeX.length; i++) {
            if (snakeX[i] === newX && snakeY[i] === newY) {
                gameOver = true;
            }
        }

        if (!gameOver) {
            // Add new head
            snakeX.unshift(newX);
            snakeY.unshift(newY);

            // Check food
            if (newX === foodX && newY === foodY) {
                score = score + 1;
                length = length + 2;
                foodX = math.random(cols);
                foodY = math.random(rows);
                buzzer.play(notes.C5, 50);
            }

            // Trim tail
            while (snakeX.length > length) {
                snakeX.pop();
                snakeY.pop();
            }
        }
    }

    // --- Draw ---
    display.fill_screen(colors.black);

    // Food
    display.fill_rect(foodX * grid, foodY * grid, grid - 1, grid - 1, colors.red);

    // Snake
    for (let i = 0; i < snakeX.length; i++) {
        let color = colors.green;
        if (i === 0) {
            color = colors.cyan;
        }
        display.fill_rect(snakeX[i] * grid, snakeY[i] * grid, grid - 1, grid - 1, color);
    }

    // Score
    display.set_cursor(5, h - 12);
    display.set_text_color(colors.yellow);
    display.print("Score: ", score, "  A=exit");

    if (gameOver) {
        display.set_cursor(w / 2 - 50, h / 2);
        display.set_text_color(colors.red);
        display.set_text_size(2);
        display.print("GAME OVER");
        display.set_text_size(1);
    }

    display.queue_draw();
    util.sleep(0.1);
}

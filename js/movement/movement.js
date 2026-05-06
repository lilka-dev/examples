// movement.js — Ball movement with controller
// Port of LUA/movement/movement.lua
// Required: ball.bmp in the same directory as this script

let BLACK = display.color565(0, 0, 0);
let WHITE = display.color565(255, 255, 255);

let ball = resources.load_image("ball.bmp", WHITE);

let ball_x = display.width / 2;
let ball_y = display.height / 2;

let running = true;

while (running) {
    let dir_x = 0;
    let dir_y = 0;
    let delta = 0.016;

    let state = controller.get_state();

    if (state.up.pressed) {
        dir_y = -1;
    } else if (state.down.pressed) {
        dir_y = 1;
    }
    if (state.left.pressed) {
        dir_x = -1;
    } else if (state.right.pressed) {
        dir_x = 1;
    }
    if (state.a.pressed) {
        running = false;
    }

    // Move ball at 50 pixels per second
    ball_x = ball_x + dir_x * 50 * delta;
    ball_y = ball_y + dir_y * 50 * delta;

    // Draw
    display.fill_screen(BLACK);
    display.draw_image(ball, math.round(ball_x), math.round(ball_y));
    display.queue_draw();

    util.sleep(delta);
}

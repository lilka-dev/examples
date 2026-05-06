// bouncing_ball.js — A ball bouncing around the screen
// Use D-pad to change ball speed. Press A to exit.

let w = display.width;
let h = display.height;
let r = 15;

let x = w / 2;
let y = h / 2;
let vx = 3;
let vy = 2;

let running = true;

while (running) {
    // Update position
    x = x + vx;
    y = y + vy;

    // Bounce off walls
    if (x - r < 0 || x + r > w) {
        vx = -vx;
        x = math.clamp(x, r, w - r);
    }
    if (y - r < 0 || y + r > h) {
        vy = -vy;
        y = math.clamp(y, r, h - r);
    }

    // Draw
    display.fill_screen(colors.black);
    display.fill_circle(math.round(x), math.round(y), r, colors.red);

    // Trail effect: smaller circles behind
    display.fill_circle(math.round(x - vx * 2), math.round(y - vy * 2), r - 4, display.color565(100, 0, 0));
    display.fill_circle(math.round(x - vx * 4), math.round(y - vy * 4), r - 8, display.color565(50, 0, 0));

    // HUD
    display.set_cursor(5, 15);
    display.set_text_color(colors.white);
    display.print("Bouncing Ball | A=exit");

    display.queue_draw();

    // Input
    let state = controller.get_state();
    if (state.a.just_pressed) {
        running = false;
    }
    if (state.up.pressed) {
        vy = vy - 0.2;
    }
    if (state.down.pressed) {
        vy = vy + 0.2;
    }
    if (state.left.pressed) {
        vx = vx - 0.2;
    }
    if (state.right.pressed) {
        vx = vx + 0.2;
    }

    util.sleep(0.016);
}

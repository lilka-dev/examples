// input_test.js — Controller input visualizer
// Port of LUA/input_test.lua
// Displays a grid showing which buttons are currently pressed.
// Press all arrows + START to exit.

let BLACK = display.color565(0, 0, 0);
let GRAY = display.color565(128, 128, 128);
let GREEN = display.color565(0, 255, 0);

// Button positions on a 14x12 grid: [x, y, w, h]
let coords_x =    [2,  2,  0,  4,  12, 10, 10, 8,  4,  8];
let coords_y =    [1,  5,  3,  3,  3,  5,  1,  3,  8,  8];
let coords_w =    [2,  2,  2,  2,  2,  2,  2,  2,  2,  2];
let coords_h =    [2,  2,  2,  2,  2,  2,  2,  2,  1,  1];

let running = true;
let cw = display.width / 14;
let ch = display.height / 12;

while (running) {
    let state = controller.get_state();

    // Exit condition: all arrows + start pressed
    if (state.up.pressed && state.down.pressed && state.left.pressed && state.right.pressed && state.start.pressed) {
        running = false;
    }

    display.fill_screen(BLACK);

    // Get pressed state for each button in order
    let pressed = [
        state.up.pressed,
        state.down.pressed,
        state.left.pressed,
        state.right.pressed,
        state.a.pressed,
        state.b.pressed,
        state.c.pressed,
        state.d.pressed,
        state.select.pressed,
        state.start.pressed,
    ];

    let i;
    for (i = 0; i < 10; i++) {
        let color = pressed[i] ? GREEN : GRAY;
        display.fill_rect(
            math.round(coords_x[i] * cw),
            math.round(coords_y[i] * ch),
            math.round(coords_w[i] * cw),
            math.round(coords_h[i] * ch),
            color
        );
    }

    display.set_cursor(16, display.height - 32);
    display.set_text_color(colors.white);
    display.print("Press all arrows");
    display.set_cursor(16, display.height - 16);
    display.print("and START to exit");

    display.queue_draw();
    util.sleep(0.016);
}

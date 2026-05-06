// cat.js — Cat with ears controlled by buttons
// Port of LUA/cat/cat.lua
// Required: no.bmp, left.bmp, right.bmp, both.bmp in the same directory

// Load images
let no = resources.load_image("no.bmp");
let left = resources.load_image("left.bmp");
let right = resources.load_image("right.bmp");
let both = resources.load_image("both.bmp");

let running = true;

while (running) {
    let state = controller.get_state();

    // Play sound when ear buttons are just pressed
    if (state.b.just_pressed || state.d.just_pressed) {
        buzzer.play(40, 100);
    }

    // Exit on A button
    if (state.a.pressed) {
        running = false;
    }

    // Draw the appropriate image based on button state
    display.draw_image(no, 0, 0);
    if (state.d.pressed) {
        display.draw_image(left, 0, 0);
    }
    if (state.b.pressed) {
        display.draw_image(right, 0, 0);
    }
    if (state.b.pressed && state.d.pressed) {
        display.draw_image(both, 0, 0);
    }
    if (state.c.pressed) {
        util.sleep(0.1);
        display.draw_image(both, 0, 0);
        buzzer.play(40, 100);
        display.queue_draw();
        util.sleep(0.1);
        display.draw_image(no, 0, 0);
    }

    display.queue_draw();
    util.sleep(0.016);
}

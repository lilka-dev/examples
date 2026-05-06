// math_demo.js — Demonstrates math functions with visual output
// Draws sine/cosine waves and shows random numbers.

let w = display.width;
let h = display.height;
let offset = 0;
let running = true;

while (running) {
    display.fill_screen(colors.black);

    // Draw sine wave
    let centerY = h / 3;
    let amplitude = 40;
    for (let x = 0; x < w - 1; x++) {
        let y1 = centerY + math.sin(math.rad(x * 2 + offset)) * amplitude;
        let y2 = centerY + math.sin(math.rad((x + 1) * 2 + offset)) * amplitude;
        display.draw_line(x, math.round(y1), x + 1, math.round(y2), colors.green);
    }

    // Draw cosine wave
    let centerY2 = h * 2 / 3;
    for (let x = 0; x < w - 1; x++) {
        let y1 = centerY2 + math.cos(math.rad(x * 2 + offset)) * amplitude;
        let y2 = centerY2 + math.cos(math.rad((x + 1) * 2 + offset)) * amplitude;
        display.draw_line(x, math.round(y1), x + 1, math.round(y2), colors.cyan);
    }

    // Labels
    display.set_cursor(5, 15);
    display.set_text_color(colors.green);
    display.print("sin()");
    display.set_cursor(5, centerY2 - amplitude - 5);
    display.set_text_color(colors.cyan);
    display.print("cos()");

    // Show random values
    display.set_cursor(5, h - 30);
    display.set_text_color(colors.yellow);
    display.print("random: ", math.random(100));

    display.set_cursor(5, h - 15);
    display.set_text_color(colors.white);
    display.print("A=exit");

    display.queue_draw();

    offset = offset + 3;

    let state = controller.get_state();
    if (state.a.just_pressed) {
        running = false;
    }
    util.sleep(0.016);
}

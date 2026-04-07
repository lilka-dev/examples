// pong.js — Simple Pong game for one player vs CPU
// Left paddle: D-pad UP/DOWN. Press A to exit.

let w = display.width;
let h = display.height;

// Ball
let bx = w / 2;
let by = h / 2;
let bvx = 3;
let bvy = 2;
let br = 4;

// Paddles
let pw = 6;
let ph = 40;
let p1y = h / 2 - ph / 2; // Player (left)
let p2y = h / 2 - ph / 2; // CPU (right)
let pSpeed = 4;

// Score
let score1 = 0;
let score2 = 0;

let running = true;

while (running) {
    // --- Input ---
    let ctrl = controller.get_state();
    if (ctrl.a.just_pressed) {
        running = false;
    }
    if (ctrl.up.pressed) {
        p1y = p1y - pSpeed;
    }
    if (ctrl.down.pressed) {
        p1y = p1y + pSpeed;
    }
    p1y = math.clamp(p1y, 0, h - ph);

    // --- CPU AI ---
    let cpuTarget = by - ph / 2;
    if (p2y < cpuTarget - 2) {
        p2y = p2y + 3;
    }
    if (p2y > cpuTarget + 2) {
        p2y = p2y - 3;
    }
    p2y = math.clamp(p2y, 0, h - ph);

    // --- Ball physics ---
    bx = bx + bvx;
    by = by + bvy;

    // Top/bottom bounce
    if (by - br < 0 || by + br > h) {
        bvy = -bvy;
        by = math.clamp(by, br, h - br);
    }

    // Left paddle collision
    if (bx - br <= pw + 5 && by >= p1y && by <= p1y + ph && bvx < 0) {
        bvx = -bvx;
        bvx = bvx + 0.3;
        bx = pw + 5 + br;
    }

    // Right paddle collision
    if (bx + br >= w - pw - 5 && by >= p2y && by <= p2y + ph && bvx > 0) {
        bvx = -bvx;
        bvx = bvx - 0.3;
        bx = w - pw - 5 - br;
    }

    // Score
    if (bx < 0) {
        score2 = score2 + 1;
        bx = w / 2;
        by = h / 2;
        bvx = 3;
        bvy = 2;
    }
    if (bx > w) {
        score1 = score1 + 1;
        bx = w / 2;
        by = h / 2;
        bvx = -3;
        bvy = -2;
    }

    // --- Draw ---
    display.fill_screen(colors.black);

    // Center line
    for (let dy = 0; dy < h; dy = dy + 10) {
        display.draw_pixel(w / 2, dy, display.color565(60, 60, 60));
    }

    // Paddles
    display.fill_rect(5, math.round(p1y), pw, ph, colors.cyan);
    display.fill_rect(w - pw - 5, math.round(p2y), pw, ph, colors.red);

    // Ball
    display.fill_circle(math.round(bx), math.round(by), br, colors.white);

    // Score
    display.set_cursor(w / 2 - 40, 15);
    display.set_text_color(colors.cyan);
    display.print(score1);
    display.set_cursor(w / 2 + 30, 15);
    display.set_text_color(colors.red);
    display.print(score2);

    display.queue_draw();
    util.sleep(0.016);
}

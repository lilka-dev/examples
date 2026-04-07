// geometry_collision.js — Interactive collision detection demo
// Move a rectangle with D-pad. Shows AABB and line intersection tests.

let w = display.width;
let h = display.height;

// Player rectangle
let px = 50;
let py = 100;
let pw = 40;
let ph = 30;

// Static rectangle
let sx = 130;
let sy = 90;
let sw = 50;
let sh = 50;

// Diagonal line
let lx1 = 30;
let ly1 = 200;
let lx2 = 200;
let ly2 = 250;

let running = true;

while (running) {
    // Input
    let ctrl = controller.get_state();
    if (ctrl.a.just_pressed) {
        running = false;
    }
    if (ctrl.up.pressed) py = py - 3;
    if (ctrl.down.pressed) py = py + 3;
    if (ctrl.left.pressed) px = px - 3;
    if (ctrl.right.pressed) px = px + 3;

    // AABB collision test
    let aabbHit = geometry.intersect_aabb(px, py, pw, ph, sx, sy, sw, sh);

    // Line intersection test (player bottom edge vs diagonal line)
    let lineHit = geometry.intersect_lines(
        px, py + ph, px + pw, py + ph,
        lx1, ly1, lx2, ly2
    );

    // Draw
    display.fill_screen(colors.black);

    // Title
    display.set_cursor(5, 12);
    display.set_text_color(colors.yellow);
    display.print("Geometry Demo - D-pad to move");

    // Static rect
    let sColor = colors.green;
    if (aabbHit) {
        sColor = colors.red;
    }
    display.draw_rect(sx, sy, sw, sh, sColor);
    display.set_cursor(sx + 5, sy + sh / 2);
    display.set_text_color(sColor);
    display.print("AABB");

    // Diagonal line
    let lColor = colors.cyan;
    if (lineHit) {
        lColor = colors.red;
    }
    display.draw_line(lx1, ly1, lx2, ly2, lColor);

    // Player rect
    display.fill_rect(px, py, pw, ph, display.color565(100, 100, 255));

    // Status
    display.set_cursor(5, h - 30);
    display.set_text_color(colors.white);
    display.print("AABB: ", aabbHit ? "HIT" : "---");
    display.set_cursor(5, h - 15);
    display.print("Line: ", lineHit ? "HIT" : "---");

    display.queue_draw();
    util.sleep(0.016);
}

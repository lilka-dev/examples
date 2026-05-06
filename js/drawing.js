// drawing.js — Drawing primitives demo
// Shows various shapes on the display.

let w = display.width;
let h = display.height;
let running = true;

while (running) {
    display.fill_screen(colors.black);

    // Draw colored rectangles
    display.fill_rect(10, 10, 60, 40, colors.red);
    display.fill_rect(80, 10, 60, 40, colors.green);
    display.fill_rect(150, 10, 60, 40, colors.blue);

    // Draw circles
    display.fill_circle(50, 100, 30, colors.cyan);
    display.draw_circle(130, 100, 30, colors.magenta);

    // Draw lines
    display.draw_line(0, 150, w, 150, colors.yellow);
    display.draw_line(0, 160, w, 160, colors.orange_red);

    // Draw triangles
    display.fill_triangle(20, 220, 60, 180, 100, 220, colors.green);
    display.draw_triangle(120, 220, 160, 180, 200, 220, colors.white);

    // Draw ellipses
    display.fill_ellipse(w / 2, 260, 80, 20, colors.magenta);

    // Info text
    display.set_cursor(10, 300);
    display.set_text_color(colors.white);
    display.print("Press A to exit");

    display.queue_draw();

    let state = controller.get_state();
    if (state.a.just_pressed) {
        running = false;
    }
    util.sleep(0.016);
}

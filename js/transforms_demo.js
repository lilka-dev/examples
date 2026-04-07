// transforms_demo.js — 2D transform demo with rotating square
// Shows rotation, scaling, and matrix transforms.
// Press A to exit.

let w = display.width;
let h = display.height;
let angle = 0;
let scale = 1.0;
let scaleDir = 0.01;
let running = true;

// Square vertices (centered at origin)
let size = 30;
let vx = [-size, size, size, -size];
let vy = [-size, -size, size, size];

while (running) {
    display.fill_screen(colors.black);

    // Create transform: rotate + scale
    let t = transforms.new();
    t = transforms.rotate(t, angle);
    t = transforms.scale(t, scale, scale);

    // Transform and draw the square
    let cx = w / 2;
    let cy = h / 2;

    for (let i = 0; i < 4; i++) {
        let next = (i + 1) % 4;
        let p1 = transforms.vtransform(t, vx[i], vy[i]);
        let p2 = transforms.vtransform(t, vx[next], vy[next]);

        display.draw_line(
            math.round(p1[0] + cx), math.round(p1[1] + cy),
            math.round(p2[0] + cx), math.round(p2[1] + cy),
            colors.cyan
        );
    }

    // Draw second square with different transform
    let t2 = transforms.new();
    t2 = transforms.rotate(t2, -angle * 0.7);
    t2 = transforms.scale(t2, scale * 0.6, scale * 0.6);

    for (let i = 0; i < 4; i++) {
        let next = (i + 1) % 4;
        let p1 = transforms.vtransform(t2, vx[i], vy[i]);
        let p2 = transforms.vtransform(t2, vx[next], vy[next]);

        display.draw_line(
            math.round(p1[0] + cx), math.round(p1[1] + cy),
            math.round(p2[0] + cx), math.round(p2[1] + cy),
            colors.magenta
        );
    }

    // Info
    display.set_cursor(5, 15);
    display.set_text_color(colors.yellow);
    display.print("Transforms Demo");
    display.set_cursor(5, h - 30);
    display.set_text_color(colors.white);
    display.print("Angle: ", math.round(angle));
    display.set_cursor(5, h - 15);
    display.print("Scale: ", math.round(scale * 100) / 100);

    display.queue_draw();

    // Clean up transforms
    transforms.delete(t);
    transforms.delete(t2);

    // Update
    angle = angle + 2;
    if (angle >= 360) angle = angle - 360;
    scale = scale + scaleDir;
    if (scale > 2.0 || scale < 0.5) scaleDir = -scaleDir;

    let ctrl = controller.get_state();
    if (ctrl.a.just_pressed) {
        running = false;
    }

    util.sleep(0.016);
}

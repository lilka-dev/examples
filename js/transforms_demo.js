// transforms_demo.js - 2D transform demo
let w = display.width;
let h = display.height;
let angle = 0;
let sc = 1.0;
let scaleDir = 0.01;
let running = true;

let size = 30;
let vx = [];
let vy = [];
vx.push(0 - size);
vx.push(size);
vx.push(size);
vx.push(0 - size);
vy.push(0 - size);
vy.push(0 - size);
vy.push(size);
vy.push(size);

while (running) {
    display.fill_screen(colors.black);

    let t = transforms.create();
    t = transforms.rotate(t, angle);
    t = transforms.scale(t, sc, sc);

    let cx = w / 2;
    let cy = h / 2;

    let i = 0;
    while (i < 4) {
        let next = (i + 1) % 4;
        let p1 = transforms.vtransform(t, vx[i], vy[i]);
        let p2 = transforms.vtransform(t, vx[next], vy[next]);
        display.draw_line(
            math.round(p1[0] + cx), math.round(p1[1] + cy),
            math.round(p2[0] + cx), math.round(p2[1] + cy),
            colors.cyan
        );
        i = i + 1;
    }

    let t2 = transforms.create();
    t2 = transforms.rotate(t2, 0 - angle * 0.7);
    t2 = transforms.scale(t2, sc * 0.6, sc * 0.6);

    i = 0;
    while (i < 4) {
        let next = (i + 1) % 4;
        let p1 = transforms.vtransform(t2, vx[i], vy[i]);
        let p2 = transforms.vtransform(t2, vx[next], vy[next]);
        display.draw_line(
            math.round(p1[0] + cx), math.round(p1[1] + cy),
            math.round(p2[0] + cx), math.round(p2[1] + cy),
            colors.magenta
        );
        i = i + 1;
    }

    display.set_cursor(5, 15);
    display.set_text_color(colors.yellow);
    display.print("Transforms Demo");
    display.set_cursor(5, h - 30);
    display.set_text_color(colors.white);
    display.print("Angle: ", math.round(angle));
    display.set_cursor(5, h - 15);
    display.print("Scale: ", math.round(sc * 100) / 100);

    display.queue_draw();

    transforms.free(t);
    transforms.free(t2);

    angle = angle + 2;
    if (angle >= 360) {
        angle = angle - 360;
    }
    sc = sc + scaleDir;
    if (sc > 2.0 || sc < 0.5) {
        scaleDir = 0 - scaleDir;
    }

    let ctrl = controller.get_state();
    if (ctrl.a.just_pressed) {
        running = false;
    }

    util.sleep(0.016);
}

// starfield.js — Classic starfield effect
// Stars fly toward the camera. Press A to exit.

let w = display.width;
let h = display.height;
let numStars = 80;

// Initialize stars as arrays: [x, y, z]
let sx = [];
let sy = [];
let sz = [];

for (let i = 0; i < numStars; i++) {
    sx[i] = math.random(-w, w);
    sy[i] = math.random(-h, h);
    sz[i] = math.random(1, w);
}

let speed = 8;
let running = true;

while (running) {
    display.fill_screen(colors.black);

    for (let i = 0; i < numStars; i++) {
        sz[i] = sz[i] - speed;
        if (sz[i] <= 0) {
            sx[i] = math.random(-w, w);
            sy[i] = math.random(-h, h);
            sz[i] = w;
        }

        let px = math.round(sx[i] * 256 / sz[i] + w / 2);
        let py = math.round(sy[i] * 256 / sz[i] + h / 2);

        if (px >= 0 && px < w && py >= 0 && py < h) {
            let brightness = math.round(255 - sz[i] * 255 / w);
            brightness = math.clamp(brightness, 50, 255);
            let color = display.color565(brightness, brightness, brightness);
            let size = math.round(3 - sz[i] * 3 / w);
            if (size < 1) {
                size = 1;
            }
            if (size > 1) {
                display.fill_circle(px, py, size, color);
            } else {
                display.draw_pixel(px, py, color);
            }
        }
    }

    display.set_cursor(5, h - 12);
    display.set_text_color(colors.white);
    display.print("A=exit  U/D=speed");

    display.queue_draw();

    let state = controller.get_state();
    if (state.a.just_pressed) {
        running = false;
    }
    if (state.up.pressed) {
        speed = math.clamp(speed + 1, 1, 30);
    }
    if (state.down.pressed) {
        speed = math.clamp(speed - 1, 1, 30);
    }

    util.sleep(0.016);
}

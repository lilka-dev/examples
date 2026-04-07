// test_draw_image.js - Draw images with transforms
let BLACK = display.color565(0, 0, 0);

let face = resources.load_image("face.bmp", BLACK, 32, 32);

let i = 5;
while (i >= 1) {
    display.fill_screen(colors.blue);
    display.set_cursor(64, 64);
    display.print("Countdown: ", i);

    let x = math.random(32, display.width - 32);
    let y = math.random(32, display.height - 32);
    display.draw_image(face, x, y);

    display.queue_draw();
    util.sleep(0.3);
    i = i - 1;
}

i = 5;
while (i >= 1) {
    display.fill_screen(colors.black);

    let x = math.random(32, display.width - 32);
    let y = math.random(32, display.height - 32);
    let rot = math.floor(math.random() * 360);
    let scX = math.random() * 0.9 + 0.1;
    let scY = math.random() * 0.9 + 0.1;

    let t = transforms.create();
    t = transforms.rotate(t, rot);
    t = transforms.scale(t, scX, scY);

    display.draw_image_transformed(face, x, y, t);
    transforms.free(t);

    display.queue_draw();
    util.sleep(0.3);
    i = i - 1;
}

display.fill_screen(colors.black);
display.set_cursor(50, 100);
display.set_text_color(colors.green);
display.print("Press A to exit");
display.queue_draw();

let key = controller.get_state();
while (!key.a.just_pressed) {
    key = controller.get_state();
    util.sleep(0.05);
}

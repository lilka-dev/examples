// test_draw_image.js — Draw images with transforms
// Port of LUA/test_draw_image.lua
// Required: face.bmp in the same directory

let BLACK = display.color565(0, 0, 0);

console.print("Printing stuff to console, yay!");

let face = resources.load_image("face.bmp", BLACK, 32, 32); // Image size is 64x64, pivot at 32,32

console.print("Face size: " + face.width + "x" + face.height);

// Phase 1: Draw face at random positions
let i;
for (i = 10; i >= 1; i--) {
    display.fill_rect(0, 0, display.width, display.height, math.random(0xFFFF));
    display.set_cursor(64, 64);
    display.print("Start in " + i + "...");

    let x = math.random(32, display.width - 32);
    let y = math.random(32, display.height - 32);
    display.draw_image(face, x, y);

    display.queue_draw();
    util.sleep(0.25);
}

// Phase 2: Draw face with transforms (rotation and scale)
for (i = 10; i >= 1; i--) {
    display.fill_rect(0, 0, display.width, display.height, math.random(0xFFFF));
    display.set_cursor(64, 64);
    display.print("Start in " + i + "...");

    let x = math.random(32, display.width - 32);
    let y = math.random(32, display.height - 32);
    let rot = math.random(360);

    let scaleX = math.max([math.random() * 1.0, 0.1]);
    let scaleY = math.max([math.random() * 1.0, 0.1]);

    let t = transforms.new();
    t = transforms.rotate(t, rot);
    t = transforms.scale(t, scaleX, scaleY);

    display.draw_image_transformed(face, x, y, t);

    display.queue_draw();
    util.sleep(0.25);
}

// Phase 3: Draw random lines with face until A is pressed
let key = controller.get_state();
while (!key.a.just_pressed) {
    let x1 = math.random(240);
    let y1 = math.random(280);
    let x2 = math.random(240);
    let y2 = math.random(280);
    let color = math.random(0xFFFF);
    display.draw_line(x1, y1, x2, y2, color);

    let x = math.random(32, display.width - 32);
    let y = math.random(32, display.height - 32);
    display.draw_image(face, x, y);

    display.queue_draw();
    key = controller.get_state();
}

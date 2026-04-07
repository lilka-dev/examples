// hello_world.js — Basic "Hello, World!" example
// Displays text on the screen and waits for button A to exit.

display.fill_screen(colors.black);
display.set_cursor(10, 40);
display.set_text_color(colors.white);
display.print("Hello, world!");
display.set_cursor(10, 60);
display.set_text_color(colors.yellow);
display.print("Press A to exit");
display.queue_draw();

let running = true;
while (running) {
    let state = controller.get_state();
    if (state.a.just_pressed) {
        running = false;
    }
    util.sleep(0.016);
}

// controller_test.js — Controller input tester
// Shows real-time button states on screen.

let buttons = ["up", "down", "left", "right", "a", "b", "c", "d", "select", "start"];
let running = true;

while (running) {
    let state = controller.get_state();

    display.fill_screen(colors.black);
    display.set_cursor(10, 20);
    display.set_text_color(colors.yellow);
    display.print("Controller Test");

    let y = 45;
    for (let i = 0; i < buttons.length; i++) {
        let name = buttons[i];
        let btn;
        if (name === "up") btn = state.up;
        if (name === "down") btn = state.down;
        if (name === "left") btn = state.left;
        if (name === "right") btn = state.right;
        if (name === "a") btn = state.a;
        if (name === "b") btn = state.b;
        if (name === "c") btn = state.c;
        if (name === "d") btn = state.d;
        if (name === "select") btn = state.select;
        if (name === "start") btn = state.start;

        let color = colors.white;
        let status = "---";
        if (btn.pressed) {
            color = colors.green;
            status = "HELD";
        }
        if (btn.just_pressed) {
            color = colors.cyan;
            status = "PRESS";
        }
        if (btn.just_released) {
            color = colors.red;
            status = "RELEASE";
        }

        display.set_cursor(10, y);
        display.set_text_color(color);
        display.print(name, ": ", status);
        y = y + 20;
    }

    display.set_cursor(10, y + 10);
    display.set_text_color(colors.magenta);
    display.print("Hold A+B to exit");

    display.queue_draw();

    if (state.a.pressed && state.b.pressed) {
        running = false;
    }

    util.sleep(0.016);
}

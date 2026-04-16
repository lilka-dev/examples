// state_counter.js — Persistent counter using state module
// The counter persists between script runs.
// Press UP to increment, DOWN to decrement, B to reset, A to exit.

if (state.count === undefined) {
    state.count = 0;
}

console.print("Counter loaded:", state.count);

let running = true;

while (running) {
    display.fill_screen(colors.black);

    // Title
    display.set_cursor(10, 20);
    display.set_text_color(colors.yellow);
    display.print("Persistent Counter");

    // Big number
    display.set_text_size(3);
    display.set_cursor(80, 100);
    display.set_text_color(colors.white);
    display.print(state.count);
    display.set_text_size(1);

    // Instructions
    display.set_cursor(10, 180);
    display.set_text_color(colors.cyan);
    display.print("UP = +1   DOWN = -1");
    display.set_cursor(10, 200);
    display.print("B = reset   A = save & exit");

    display.queue_draw();

    let ctrl = controller.get_state();

    if (ctrl.up.just_pressed) {
        state.count = state.count + 1;
    }
    if (ctrl.down.just_pressed) {
        state.count = state.count - 1;
    }
    if (ctrl.b.just_pressed) {
        state.count = 0;
        state.clear();
        console.print("Counter reset!");
    }
    if (ctrl.a.just_pressed) {
        state.save();
        console.print("Counter saved:", state.count);
        running = false;
    }

    util.sleep(0.03);
}

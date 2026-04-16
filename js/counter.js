// counter.js — Persistent launch counter
// Port of LUA/counter/counter.lua
// Each time this script runs, the counter increments by 1.
// Uses state persistence: the counter value is saved between runs.

// Load persistent state (or initialize if empty)
let counter = state.get("counter");
if (counter === undefined) {
    counter = 0;
}
counter = counter + 1;
state.set("counter", counter);

display.fill_screen(display.color565(64, 0, 64));
display.set_cursor(0, 64);
display.set_text_color(colors.white);
display.print("Launch counter: ", counter);
display.queue_draw();
util.sleep(2);

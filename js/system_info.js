// system_info.js — Displays system information
// Shows RAM usage, time, and other system stats.

let running = true;

while (running) {
    display.fill_screen(colors.black);

    // Title
    display.set_cursor(10, 20);
    display.set_text_color(colors.yellow);
    display.print("System Information");

    // RAM info
    let freeRam = util.free_ram();
    let totalRam = util.total_ram();
    let usedRam = totalRam - freeRam;
    let pct = math.round(usedRam * 100 / totalRam);

    display.set_cursor(10, 50);
    display.set_text_color(colors.white);
    display.print("Free RAM: ", freeRam, " B");

    display.set_cursor(10, 70);
    display.print("Total RAM: ", totalRam, " B");

    display.set_cursor(10, 90);
    display.print("Used: ", pct, "%");

    // RAM bar
    let barX = 20;
    let barY = 110;
    display.draw_rect(barX, barY, display.width - 40, 15, colors.white);
    let fillW = math.round((display.width - 42) * usedRam / totalRam);
    let barColor = colors.green;
    if (pct > 70) {
        barColor = colors.yellow;
    }
    if (pct > 90) {
        barColor = colors.red;
    }
    display.fill_rect(barX + 1, barY + 1, fillW, 13, barColor);

    // Uptime
    let uptime = util.time();
    let mins = math.floor(uptime / 60);
    let secs = math.floor(uptime) - mins * 60;
    display.set_cursor(10, 140);
    display.set_text_color(colors.cyan);
    display.print("Uptime: ", mins, "m ", secs, "s");

    // Display info
    display.set_cursor(10, 170);
    display.set_text_color(colors.magenta);
    display.print("Display: ", display.width, "x", display.height);

    // Footer
    display.set_cursor(10, 210);
    display.set_text_color(colors.white);
    display.print("Press A to exit");

    display.queue_draw();

    let state = controller.get_state();
    if (state.a.just_pressed) {
        running = false;
    }
    util.sleep(0.1);
}

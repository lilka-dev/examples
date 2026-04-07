// wifi_scanner.js — Scans for WiFi networks and displays results
// Press A to rescan, B to exit.

function scan() {
    display.fill_screen(colors.black);
    display.set_cursor(10, 20);
    display.set_text_color(colors.yellow);
    display.print("Scanning WiFi...");
    display.queue_draw();

    let networks = wifi.scan();

    display.fill_screen(colors.black);
    display.set_cursor(10, 15);
    display.set_text_color(colors.yellow);
    display.print("WiFi Networks: ", networks.length);

    let y = 35;
    let max = networks.length;
    if (max > 12) {
        max = 12;
    }

    for (let i = 0; i < max; i++) {
        let rssi = wifi.get_rssi(i);
        let color = colors.green;
        if (rssi < -70) {
            color = colors.yellow;
        }
        if (rssi < -85) {
            color = colors.red;
        }

        display.set_cursor(10, y);
        display.set_text_color(color);
        display.print(networks[i]);
        display.set_cursor(180, y);
        display.print(rssi, " dBm");
        y = y + 18;
    }

    if (networks.length > 12) {
        display.set_cursor(10, y);
        display.set_text_color(colors.white);
        display.print("... and ", networks.length - 12, " more");
    }

    display.set_cursor(10, display.height - 20);
    display.set_text_color(colors.white);
    display.print("A=rescan  B=exit");
    display.queue_draw();
}

scan();

let running = true;
while (running) {
    let state = controller.get_state();
    if (state.a.just_pressed) {
        scan();
    }
    if (state.b.just_pressed) {
        running = false;
    }
    util.sleep(0.05);
}

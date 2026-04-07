// file_browser.js — Simple SD card file browser
// Navigate with D-pad, A to exit.

let path = "/";
let scroll = 0;
let maxVisible = 14;

function showDir(dirPath) {
    let files = sdcard.ls(dirPath);
    if (files === undefined) {
        display.fill_screen(colors.black);
        display.set_cursor(10, 40);
        display.set_text_color(colors.red);
        display.print("SD card not available!");
        display.set_cursor(10, 70);
        display.set_text_color(colors.white);
        display.print("Press A to exit");
        display.queue_draw();
        return undefined;
    }
    return files;
}

let files = showDir(path);
let selected = 0;

let running = true;
while (running) {
    if (files !== undefined) {
        display.fill_screen(colors.black);

        // Header
        display.set_cursor(5, 12);
        display.set_text_color(colors.yellow);
        display.print(path);

        display.draw_line(0, 18, display.width, 18, colors.yellow);

        // File list
        let y = 30;
        let start = scroll;
        let end = scroll + maxVisible;
        if (end > files.length) {
            end = files.length;
        }

        for (let i = start; i < end; i++) {
            display.set_cursor(15, y);
            if (i === selected) {
                display.set_text_color(colors.cyan);
                display.fill_rect(0, y - 10, display.width, 16, display.color565(30, 30, 60));
                display.set_cursor(5, y);
                display.print(">");
                display.set_cursor(15, y);
            } else {
                display.set_text_color(colors.white);
            }
            display.print(files[i]);
            y = y + 16;
        }

        // Footer
        display.set_cursor(5, display.height - 12);
        display.set_text_color(colors.white);
        display.print(files.length, " items | A=exit");

        display.queue_draw();
    }

    let state = controller.get_state();
    if (state.a.just_pressed) {
        running = false;
    }
    if (files !== undefined) {
        if (state.down.just_pressed && selected < files.length - 1) {
            selected = selected + 1;
            if (selected >= scroll + maxVisible) {
                scroll = scroll + 1;
            }
        }
        if (state.up.just_pressed && selected > 0) {
            selected = selected - 1;
            if (selected < scroll) {
                scroll = scroll - 1;
            }
        }
    }

    util.sleep(0.03);
}

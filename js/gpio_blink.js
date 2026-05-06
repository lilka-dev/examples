// gpio_blink.js — Blink an LED on GPIO pin 12
// Connect an LED with a resistor to pin 12.
// Press A to exit.

let ledPin = 12;
gpio.mode(ledPin, gpio.OUTPUT);

let ledOn = false;
let running = true;

while (running) {
    ledOn = !ledOn;
    if (ledOn) {
        gpio.write(ledPin, gpio.HIGH);
    } else {
        gpio.write(ledPin, gpio.LOW);
    }

    // Show state on display
    display.fill_screen(colors.black);

    display.set_cursor(10, 30);
    display.set_text_color(colors.yellow);
    display.print("GPIO Blink Demo");

    display.set_cursor(10, 60);
    display.set_text_color(colors.white);
    display.print("Pin ", ledPin, ": ");

    if (ledOn) {
        display.fill_circle(display.width / 2, 130, 30, colors.green);
        display.set_cursor(display.width / 2 - 10, 135);
        display.set_text_color(colors.black);
        display.print("ON");
    } else {
        display.draw_circle(display.width / 2, 130, 30, colors.green);
        display.set_cursor(display.width / 2 - 12, 135);
        display.set_text_color(colors.green);
        display.print("OFF");
    }

    display.set_cursor(10, 200);
    display.set_text_color(colors.white);
    display.print("Press A to exit");
    display.queue_draw();

    // Check exit
    let state = controller.get_state();
    if (state.a.just_pressed) {
        gpio.write(ledPin, gpio.LOW);
        running = false;
    }

    util.sleep(0.5);
}

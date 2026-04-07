// buzzer_melody.js — Plays a simple melody on the piezo buzzer
// Press A to exit at any time.

// Simple melody: "Ode to Joy" fragment
let melody = [
    [notes.E4, 4], [notes.E4, 4], [notes.F4, 4], [notes.G4, 4],
    [notes.G4, 4], [notes.F4, 4], [notes.E4, 4], [notes.D4, 4],
    [notes.C4, 4], [notes.C4, 4], [notes.D4, 4], [notes.E4, 4],
    [notes.E4, 3], [notes.D4, 8], [notes.D4, 2],
    [notes.REST, 4],
    [notes.E4, 4], [notes.E4, 4], [notes.F4, 4], [notes.G4, 4],
    [notes.G4, 4], [notes.F4, 4], [notes.E4, 4], [notes.D4, 4],
    [notes.C4, 4], [notes.C4, 4], [notes.D4, 4], [notes.E4, 4],
    [notes.D4, 3], [notes.C4, 8], [notes.C4, 2]
];

let tempo = 144;

display.fill_screen(colors.black);
display.set_cursor(10, 40);
display.set_text_color(colors.yellow);
display.print("Ode to Joy");
display.set_cursor(10, 70);
display.set_text_color(colors.white);
display.print("Playing melody...");
display.set_cursor(10, 100);
display.print("Press A to stop");
display.queue_draw();

buzzer.play_melody(melody, tempo);

// Wait for button press
let running = true;
while (running) {
    let state = controller.get_state();
    if (state.a.just_pressed) {
        buzzer.stop();
        running = false;
    }
    util.sleep(0.05);
}

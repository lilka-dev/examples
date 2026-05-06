// crypto_demo.js — AES encryption/decryption and hashing demo
// Press A to exit.

let key = "0123456789abcdef"; // 16 bytes = AES-128
let message = "Hello, Lilka!";

// Encrypt
let encrypted = crypto.encrypt(message, key);
console.print("Encrypted (hex):", encrypted);

// Decrypt
let decrypted = crypto.decrypt(encrypted, key);
console.print("Decrypted:", decrypted);

// MD5 hash
let hash = crypto.md5(message);
console.print("MD5:", hash);

// CRC32
let crc = crypto.crc32(message);
console.print("CRC32:", crc);

// Display results
display.fill_screen(colors.black);

display.set_cursor(5, 15);
display.set_text_color(colors.yellow);
display.print("Crypto Demo");

display.set_cursor(5, 40);
display.set_text_color(colors.white);
display.print("Original: ", message);

display.set_cursor(5, 60);
display.set_text_color(colors.cyan);
display.print("Encrypted:");
display.set_cursor(5, 75);
// Show truncated hex
if (encrypted.length > 32) {
    display.print(encrypted.slice(0, 32), "...");
} else {
    display.print(encrypted);
}

display.set_cursor(5, 100);
display.set_text_color(colors.green);
display.print("Decrypted: ", decrypted);

display.set_cursor(5, 130);
display.set_text_color(colors.magenta);
display.print("MD5: ", hash);

display.set_cursor(5, 160);
display.set_text_color(colors.orange_red);
display.print("CRC32: ", crc);

display.set_cursor(5, 200);
display.set_text_color(colors.white);
display.print("Press A to exit");
display.queue_draw();

let running = true;
while (running) {
    let state = controller.get_state();
    if (state.a.just_pressed) {
        running = false;
    }
    util.sleep(0.05);
}

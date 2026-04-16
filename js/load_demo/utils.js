// utils.js — допоміжні функції, які завантажуються через load()

// Малює рамку навколо екрану
function drawBorder(color) {
    display.fill_rect(0, 0, 320, 240, color);
    display.fill_rect(2, 2, 316, 236, display.color565(0, 0, 0));
}

// Малює текст по центру екрану
function drawCentered(text, y, color, size) {
    display.set_cursor(160 - text.length * size * 3, y);
    display.set_text_size(size);
    display.set_text_color(color);
    display.print(text);
}

// Повертає випадковий колір (RGB565)
function randomColor() {
    return display.color565(
        math.random(50, 255),
        math.random(50, 255),
        math.random(50, 255)
    );
}

// Обмежує значення у діапазоні
function clamp(val, minVal, maxVal) {
    if (val < minVal) return minVal;
    if (val > maxVal) return maxVal;
    return val;
}

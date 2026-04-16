// load_demo.js — демонстрація load() для підключення модулів
//
// Цей приклад показує як розбити код на кілька файлів
// та підключити їх через вбудовану функцію load().

// Завантажуємо допоміжні модулі
load('utils.js');
load('particles.js');

// Головна програма
let white = display.color565(255, 255, 255);
let cyan = display.color565(0, 255, 255);
let yellow = display.color565(255, 255, 0);
let green = display.color565(0, 255, 0);

let cursorX = 160;
let cursorY = 120;
let speed = 3;
let frame = 0;

while (true) {
    // Зчитуємо стан контролера
    let state = controller.get_state();

    // Рухаємо курсор
    if (state.up.pressed) {
        cursorY = cursorY - speed;
    }
    if (state.down.pressed) {
        cursorY = cursorY + speed;
    }
    if (state.left.pressed) {
        cursorX = cursorX - speed;
    }
    if (state.right.pressed) {
        cursorX = cursorX + speed;
    }

    // Обмежуємо межами екрану (функція з utils.js)
    cursorX = clamp(cursorX, 10, 310);
    cursorY = clamp(cursorY, 10, 230);

    // Кнопка A — створити частинки (функція з particles.js)
    if (state.a.pressed) {
        let j = 0;
        while (j < 5) {
            spawnParticle(cursorX, cursorY);
            j = j + 1;
        }
    }

    // Оновлюємо фізику частинок (функція з particles.js)
    updateParticles();

    // Малюємо
    display.fill_screen(display.color565(0, 0, 0));

    // Рамка (функція з utils.js)
    drawBorder(cyan);

    // Заголовок (функція з utils.js)
    drawCentered("load() demo", 8, yellow, 1);

    // Малюємо частинки (функція з particles.js)
    drawParticles();

    // Курсор
    display.fill_circle(cursorX, cursorY, 4, white);
    display.draw_circle(cursorX, cursorY, 6, green);

    // Інструкція
    display.set_cursor(5, 225);
    display.set_text_size(1);
    display.set_text_color(white);
    display.print("D-pad:move A:particles Count:", particles.length);

    display.queue_draw();

    // Вихід
    if (state.start.just_pressed) {
        break;
    }

    util.sleep(0.016);
    frame = frame + 1;
}

drawCentered("Bye!", 110, yellow, 2);
display.queue_draw();
util.sleep(1);

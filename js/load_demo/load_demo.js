// load_demo.js — демонстрація load() для підключення модулів
//
// Цей приклад показує як розбити код на кілька файлів
// та підключити їх через вбудовану функцію load().
//
// Структура:
//   load_demo/
//     load_demo.js    — головний скрипт (цей файл)
//     utils.js        — допоміжні функції (drawBorder, drawCentered, randomColor, clamp)
//     particles.js    — система частинок (spawnParticle, updateParticles, drawParticles)

// Завантажуємо допоміжні модулі
// load() виконує файл і всі функції стають доступні в поточному scope
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
    if (state.up) cursorY = cursorY - speed;
    if (state.down) cursorY = cursorY + speed;
    if (state.left) cursorX = cursorX - speed;
    if (state.right) cursorX = cursorX + speed;

    // Обмежуємо межами екрану (функція з utils.js)
    cursorX = clamp(cursorX, 10, 310);
    cursorY = clamp(cursorY, 10, 230);

    // Кнопка A — створити частинки (функція з particles.js)
    if (state.a) {
        let j = 0;
        while (j < 5) {
            spawnParticle(cursorX, cursorY);
            j++;
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
    display.print("D-pad: move | A: particles | Particles: " + JSON.stringify(particles.length));

    display.render();

    // Вихід
    if (state.start) break;

    util.sleep(16);
    frame++;
}

drawCentered("Bye!", 110, yellow, 2);
display.render();
util.sleep(1000);

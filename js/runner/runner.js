// runner.js — Platformer runner with sprite animation
// Port of LUA/runner/runner.lua
// Character sprites by https://laredgames.itch.io/coins-free
// Required: boy_stand.bmp, boy_run_1.bmp, boy_run_2.bmp, boy_run_3.bmp, boy_jump.bmp

let WHITE = display.color565(255, 255, 255);
let BLACK = display.color565(0, 0, 0);

// Load sprites
let STAND_SPRITE = resources.load_image("boy_stand.bmp", BLACK);
let RUN_SPRITE_1 = resources.load_image("boy_run_1.bmp", BLACK);
let RUN_SPRITE_2 = resources.load_image("boy_run_2.bmp", BLACK);
let RUN_SPRITE_3 = resources.load_image("boy_run_3.bmp", BLACK);
let JUMP_SPRITE = resources.load_image("boy_jump.bmp", BLACK);

// Create flipped (left-facing) sprites
let STAND_LEFT = resources.flip_image_x(STAND_SPRITE);
let RUN_LEFT_1 = resources.flip_image_x(RUN_SPRITE_1);
let RUN_LEFT_2 = resources.flip_image_x(RUN_SPRITE_2);
let RUN_LEFT_3 = resources.flip_image_x(RUN_SPRITE_3);
let JUMP_LEFT = resources.flip_image_x(JUMP_SPRITE);

// Player state
let player_x = 128;
let player_y = 128;
let player_width = 32;
let player_height = 32;
let speed_x = 0;
let speed_y = 0;
let look_direction = 1; // 1 = right, -1 = left
let is_airborne = true;
let gravity = 200;

let delta = 0.016;
let running = true;

while (running) {
    // Physics
    speed_y = speed_y + gravity * delta;
    player_x = player_x + speed_x * delta;
    player_y = player_y + speed_y * delta;

    // Simple ground collision (bottom of screen)
    if (player_y > display.height - player_height) {
        player_y = display.height - player_height;
        speed_y = 0;
        is_airborne = false;
    }

    // Select sprite
    let image;
    let frame = math.floor(util.time() * 15) % 4;

    if (look_direction === 1) {
        // Right-facing
        if (is_airborne) {
            image = JUMP_SPRITE;
        } else if (math.abs(speed_x) < 1) {
            image = STAND_SPRITE;
        } else {
            if (frame === 0) {
                image = RUN_SPRITE_1;
            } else if (frame === 1) {
                image = RUN_SPRITE_2;
            } else if (frame === 2) {
                image = RUN_SPRITE_3;
            } else {
                image = RUN_SPRITE_2;
            }
        }
    } else {
        // Left-facing
        if (is_airborne) {
            image = JUMP_LEFT;
        } else if (math.abs(speed_x) < 1) {
            image = STAND_LEFT;
        } else {
            if (frame === 0) {
                image = RUN_LEFT_1;
            } else if (frame === 1) {
                image = RUN_LEFT_2;
            } else if (frame === 2) {
                image = RUN_LEFT_3;
            } else {
                image = RUN_LEFT_2;
            }
        }
    }

    // Input
    let state = controller.get_state();
    if (state.start.pressed) {
        running = false;
    }

    speed_x = 0;
    if (state.left.pressed) {
        speed_x = -100;
        look_direction = -1;
    }
    if (state.right.pressed) {
        speed_x = 100;
        look_direction = 1;
    }
    if (state.a.just_pressed && !is_airborne) {
        speed_y = -150;
        is_airborne = true;
    }

    // Draw
    display.fill_screen(BLACK);
    // Draw player centered at bottom-center of sprite
    display.draw_image(image, math.round(player_x - player_width / 2), math.round(player_y - player_height));

    display.set_cursor(5, 15);
    display.set_text_color(WHITE);
    display.print("Runner | A=jump | START=exit");

    display.queue_draw();
    util.sleep(delta);
}

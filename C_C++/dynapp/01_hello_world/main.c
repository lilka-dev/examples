/**
 * @file main.c
 * @brief Hello World — Simplest Keira DynApp example
 *
 * This is the minimal example showing:
 *  - Display text on screen
 *  - Exit on button press
 *
 * Build:
 *   cmake -DCMAKE_TOOLCHAIN_FILE=../xtensa-esp32s3.cmake .
 *   make
 */

#include "keira_api.h"

int app_main(int argc, char *argv[]) {
  (void)argc;
  (void)argv;

  int16_t scr_w = keira_display_width();
  int16_t scr_h = keira_display_height();

  /* Clear screen */
  keira_display_fill_screen(KEIRA_COLOR_BLACK);

  /* Draw centered title */
  keira_display_set_cursor(scr_w / 2 - 60, scr_h / 2 - 20);
  keira_display_set_text_color(KEIRA_COLOR_CYAN);
  keira_display_set_text_size(2);
  keira_display_println("Hello Keira!");

  /* Draw subtitle */
  keira_display_set_cursor(scr_w / 2 - 70, scr_h / 2 + 10);
  keira_display_set_text_color(KEIRA_COLOR_WHITE);
  keira_display_set_text_size(1);
  keira_display_println("Press B to exit");

  keira_queue_draw();

  /* Wait for B button */
  for (;;) {
    uint32_t state = keira_controller_get_state();
    if (state & KEIRA_JUST_B) {
      break;
    }
    keira_delay(16);
  }

  return 0;
}

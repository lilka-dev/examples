/**
 * @file main.c
 * @brief Input Test — Keira DynApp example
 *
 * Demonstrates controller input handling:
 *  - D-pad, A/B/C/D buttons
 *  - Pressed vs justPressed detection
 *  - Visual button state feedback
 *
 * Build:
 *   cmake -DCMAKE_TOOLCHAIN_FILE=../xtensa-esp32s3.cmake .
 *   make
 */

#include "keira_api.h"

/* Draw a button indicator */
static void draw_button(int16_t x, int16_t y, const char *label, int pressed,
                        int just) {
  uint16_t bg_color =
      pressed ? KEIRA_COLOR_GREEN : keira_display_color565(40, 40, 40);
  uint16_t border_color =
      just ? KEIRA_COLOR_YELLOW : keira_display_color565(80, 80, 80);

  keira_display_fill_rect(x, y, 30, 20, bg_color);
  keira_display_draw_rect(x, y, 30, 20, border_color);

  keira_display_set_cursor(x + 4, y + 6);
  keira_display_set_text_color(pressed ? KEIRA_COLOR_BLACK : KEIRA_COLOR_WHITE);
  keira_display_set_text_size(1);
  keira_display_print(label);
}

int app_main(int argc, char *argv[]) {
  (void)argc;
  (void)argv;

  int16_t w = keira_display_width();
  int16_t h = keira_display_height();

  uint32_t press_count = 0;

  for (;;) {
    uint32_t state = keira_controller_get_state();

    /* Exit on START + SELECT */
    if ((state & KEIRA_BTN_START) && (state & KEIRA_BTN_SELECT)) {
      break;
    }

    /* Count any just pressed button */
    if (state & 0xFFFF0000) {
      press_count++;
    }

    keira_display_fill_screen(KEIRA_COLOR_BLACK);

    /* Title */
    keira_display_set_cursor(w / 2 - 50, 10);
    keira_display_set_text_color(KEIRA_COLOR_CYAN);
    keira_display_set_text_size(1);
    keira_display_println("Input Test");

    /* D-Pad */
    keira_display_set_cursor(30, 40);
    keira_display_set_text_color(KEIRA_COLOR_WHITE);
    keira_display_print("D-Pad:");

    draw_button(60, 55, "UP", state & KEIRA_BTN_UP, state & KEIRA_JUST_UP);
    draw_button(25, 80, "LT", state & KEIRA_BTN_LEFT, state & KEIRA_JUST_LEFT);
    draw_button(60, 80, "DN", state & KEIRA_BTN_DOWN, state & KEIRA_JUST_DOWN);
    draw_button(95, 80, "RT", state & KEIRA_BTN_RIGHT,
                state & KEIRA_JUST_RIGHT);

    /* Action buttons */
    keira_display_set_cursor(150, 40);
    keira_display_set_text_color(KEIRA_COLOR_WHITE);
    keira_display_print("Buttons:");

    draw_button(150, 55, "A", state & KEIRA_BTN_A, state & KEIRA_JUST_A);
    draw_button(185, 55, "B", state & KEIRA_BTN_B, state & KEIRA_JUST_B);
    draw_button(150, 80, "C", state & KEIRA_BTN_C, state & KEIRA_JUST_C);
    draw_button(185, 80, "D", state & KEIRA_BTN_D, state & KEIRA_JUST_D);

    /* System buttons */
    draw_button(60, 120, "SEL", state & KEIRA_BTN_SELECT,
                state & KEIRA_JUST_SELECT);
    draw_button(110, 120, "STA", state & KEIRA_BTN_START,
                state & KEIRA_JUST_START);

    /* Press counter */
    keira_display_set_cursor(10, h - 40);
    keira_display_set_text_color(KEIRA_COLOR_YELLOW);
    keira_display_print("Presses: ");
    {
      char buf[12];
      int n = press_count;
      int i = 0;
      if (n == 0) {
        buf[i++] = '0';
      } else {
        char tmp[12];
        int j = 0;
        while (n > 0) {
          tmp[j++] = '0' + (n % 10);
          n /= 10;
        }
        while (j > 0)
          buf[i++] = tmp[--j];
      }
      buf[i] = '\0';
      keira_display_print(buf);
    }

    /* Instructions */
    keira_display_set_cursor(10, h - 20);
    keira_display_set_text_color(keira_display_color565(128, 128, 128));
    keira_display_print("START+SELECT to exit");

    keira_queue_draw();
    keira_delay(16);
  }

  return 0;
}

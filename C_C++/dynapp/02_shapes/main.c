/**
 * @file main.c
 * @brief Drawing Shapes — Keira DynApp example
 *
 * Demonstrates all display drawing primitives:
 *  - Pixels, lines, rectangles, circles, triangles
 *  - Colors and RGB565 conversion
 *
 * Build:
 *   cmake -DCMAKE_TOOLCHAIN_FILE=../xtensa-esp32s3.cmake .
 *   make
 */

#include "keira_api.h"

int app_main(int argc, char *argv[]) {
  (void)argc;
  (void)argv;

  int16_t w = keira_display_width();
  int16_t h = keira_display_height();

  for (;;) {
    uint32_t state = keira_controller_get_state();
    if (state & KEIRA_JUST_B)
      break;

    keira_display_fill_screen(KEIRA_COLOR_BLACK);

    /* Title */
    keira_display_set_cursor(4, 4);
    keira_display_set_text_color(KEIRA_COLOR_WHITE);
    keira_display_set_text_size(1);
    keira_display_println("Drawing Shapes Demo");

    /* Draw pixels in a pattern */
    for (int i = 0; i < 20; i++) {
      keira_display_draw_pixel(20 + i * 3, 30, KEIRA_COLOR_RED);
      keira_display_draw_pixel(20 + i * 3, 32, KEIRA_COLOR_GREEN);
      keira_display_draw_pixel(20 + i * 3, 34, KEIRA_COLOR_BLUE);
    }

    /* Draw lines */
    keira_display_draw_line(10, 50, 100, 50, KEIRA_COLOR_YELLOW);
    keira_display_draw_line(10, 55, 100, 70, KEIRA_COLOR_CYAN);
    keira_display_draw_line(10, 75, 100, 55, KEIRA_COLOR_MAGENTA);

    /* Draw rectangles */
    keira_display_draw_rect(120, 30, 40, 30, KEIRA_COLOR_RED);
    keira_display_fill_rect(125, 35, 30, 20, keira_display_color565(128, 0, 0));

    keira_display_draw_rect(170, 30, 40, 30, KEIRA_COLOR_GREEN);
    keira_display_fill_rect(175, 35, 30, 20, keira_display_color565(0, 128, 0));

    /* Draw circles */
    keira_display_draw_circle(40, 110, 20, KEIRA_COLOR_CYAN);
    keira_display_fill_circle(40, 110, 15, keira_display_color565(0, 64, 128));

    keira_display_draw_circle(90, 110, 20, KEIRA_COLOR_ORANGE);
    keira_display_fill_circle(90, 110, 15, keira_display_color565(128, 64, 0));

    /* Draw triangles */
    keira_display_draw_triangle(140, 130, 160, 90, 180, 130,
                                KEIRA_COLOR_YELLOW);
    keira_display_fill_triangle(145, 125, 160, 95, 175, 125,
                                keira_display_color565(128, 128, 0));

    keira_display_draw_triangle(190, 130, 210, 90, 230, 130,
                                KEIRA_COLOR_MAGENTA);
    keira_display_fill_triangle(195, 125, 210, 95, 225, 125,
                                keira_display_color565(128, 0, 128));

    /* Color gradient bar */
    for (int x = 0; x < w - 20; x++) {
      uint8_t r = (x * 255) / (w - 20);
      uint8_t g = 255 - r;
      uint8_t b = (x * 128) / (w - 20);
      keira_display_draw_line(10 + x, h - 30, 10 + x, h - 10,
                              keira_display_color565(r, g, b));
    }

    /* Instructions */
    keira_display_set_cursor(4, h - 40);
    keira_display_set_text_color(keira_display_color565(128, 128, 128));
    keira_display_print("Press B to exit");

    keira_queue_draw();
    keira_delay(50);
  }

  return 0;
}

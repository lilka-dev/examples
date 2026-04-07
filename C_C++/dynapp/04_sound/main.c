/**
 * @file main.c
 * @brief Sound & Music — Keira DynApp example
 *
 * Demonstrates buzzer API:
 *  - Play tones at different frequencies
 *  - Simple melody playback
 *  - Interactive piano keys
 *
 * Build:
 *   cmake -DCMAKE_TOOLCHAIN_FILE=../xtensa-esp32s3.cmake .
 *   make
 */

#include "keira_api.h"

/* Musical note frequencies (Hz) */
#define NOTE_C4 262
#define NOTE_D4 294
#define NOTE_E4 330
#define NOTE_F4 349
#define NOTE_G4 392
#define NOTE_A4 440
#define NOTE_B4 494
#define NOTE_C5 523

/* Simple melody: Twinkle Twinkle */
static const int melody[] = {
    NOTE_C4, NOTE_C4, NOTE_G4, NOTE_G4, NOTE_A4, NOTE_A4, NOTE_G4, 0,
    NOTE_F4, NOTE_F4, NOTE_E4, NOTE_E4, NOTE_D4, NOTE_D4, NOTE_C4, 0};
static const int melody_len = 16;

static void draw_key(int16_t x, int16_t y, const char *label, int active) {
  uint16_t bg = active ? KEIRA_COLOR_CYAN : KEIRA_COLOR_WHITE;
  keira_display_fill_rect(x, y, 25, 60, bg);
  keira_display_draw_rect(x, y, 25, 60, KEIRA_COLOR_BLACK);
  keira_display_set_cursor(x + 8, y + 45);
  keira_display_set_text_color(KEIRA_COLOR_BLACK);
  keira_display_set_text_size(1);
  keira_display_print(label);
}

int app_main(int argc, char *argv[]) {
  (void)argc;
  (void)argv;

  int16_t w = keira_display_width();
  int16_t h = keira_display_height();

  int melody_pos = -1;
  int playing_melody = 0;
  uint32_t next_note_time = 0;

  for (;;) {
    uint32_t state = keira_controller_get_state();
    uint32_t now = keira_millis();

    if (state & KEIRA_JUST_B)
      break;

    /* Start melody with SELECT */
    if (state & KEIRA_JUST_SELECT) {
      playing_melody = 1;
      melody_pos = 0;
      next_note_time = now;
    }

    /* Play melody notes */
    if (playing_melody && now >= next_note_time) {
      if (melody_pos < melody_len) {
        int freq = melody[melody_pos];
        if (freq > 0) {
          keira_buzzer_play((float)freq, 200);
        } else {
          keira_buzzer_stop();
        }
        melody_pos++;
        next_note_time = now + 250;
      } else {
        playing_melody = 0;
        keira_buzzer_stop();
      }
    }

    /* Interactive piano keys */
    int key_active[8] = {0};
    if (!playing_melody) {
      if (state & KEIRA_BTN_UP) {
        key_active[0] = 1;
        if (state & KEIRA_JUST_UP)
          keira_buzzer_play(NOTE_C4, 100);
      }
      if (state & KEIRA_BTN_RIGHT) {
        key_active[1] = 1;
        if (state & KEIRA_JUST_RIGHT)
          keira_buzzer_play(NOTE_D4, 100);
      }
      if (state & KEIRA_BTN_DOWN) {
        key_active[2] = 1;
        if (state & KEIRA_JUST_DOWN)
          keira_buzzer_play(NOTE_E4, 100);
      }
      if (state & KEIRA_BTN_LEFT) {
        key_active[3] = 1;
        if (state & KEIRA_JUST_LEFT)
          keira_buzzer_play(NOTE_F4, 100);
      }
      if (state & KEIRA_BTN_A) {
        key_active[4] = 1;
        if (state & KEIRA_JUST_A)
          keira_buzzer_play(NOTE_G4, 100);
      }
      if (state & KEIRA_BTN_C) {
        key_active[5] = 1;
        if (state & KEIRA_JUST_C)
          keira_buzzer_play(NOTE_A4, 100);
      }
      if (state & KEIRA_BTN_D) {
        key_active[6] = 1;
        if (state & KEIRA_JUST_D)
          keira_buzzer_play(NOTE_B4, 100);
      }
      if (state & KEIRA_BTN_START) {
        key_active[7] = 1;
        if (state & KEIRA_JUST_START)
          keira_buzzer_play(NOTE_C5, 100);
      }
    }

    /* Draw */
    keira_display_fill_screen(keira_display_color565(32, 32, 64));

    keira_display_set_cursor(w / 2 - 50, 10);
    keira_display_set_text_color(KEIRA_COLOR_YELLOW);
    keira_display_set_text_size(1);
    keira_display_println("Sound Demo");

    /* Draw piano keys */
    int16_t key_x = (w - 8 * 27) / 2;
    int16_t key_y = 40;
    const char *labels[] = {"C", "D", "E", "F", "G", "A", "B", "C"};
    for (int i = 0; i < 8; i++) {
      draw_key(key_x + i * 27, key_y, labels[i], key_active[i]);
    }

    /* Key mapping */
    keira_display_set_cursor(10, 110);
    keira_display_set_text_color(KEIRA_COLOR_WHITE);
    keira_display_set_text_size(1);
    keira_display_println("UP/RT/DN/LT: C-D-E-F");
    keira_display_set_cursor(10, 122);
    keira_display_println("A/C/D/START: G-A-B-C");

    /* Playing indicator */
    if (playing_melody) {
      keira_display_set_cursor(w / 2 - 40, h - 50);
      keira_display_set_text_color(KEIRA_COLOR_GREEN);
      keira_display_print("Playing...");
    }

    /* Instructions */
    keira_display_set_cursor(10, h - 30);
    keira_display_set_text_color(keira_display_color565(128, 128, 128));
    keira_display_print("SELECT:melody B:exit");

    keira_queue_draw();
    keira_delay(16);
  }

  keira_buzzer_stop();
  return 0;
}

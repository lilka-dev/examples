/**
 * @file main.c
 * @brief Pong Game — Keira DynApp example
 *
 * A classic Pong game demonstrating:
 *  - Game loop with physics
 *  - AI opponent
 *  - Score tracking
 *  - Sound effects
 *
 * Build:
 *   cmake -DCMAKE_TOOLCHAIN_FILE=../xtensa-esp32s3.cmake .
 *   make
 */

#include "keira_api.h"

#define PADDLE_W 6
#define PADDLE_H 30
#define BALL_SIZE 4
#define PADDLE_SPEED 4
#define AI_SPEED 3

static int abs_val(int x) { return x < 0 ? -x : x; }

int app_main(int argc, char *argv[]) {
  (void)argc;
  (void)argv;

  int16_t w = keira_display_width();
  int16_t h = keira_display_height();

  /* Paddle positions (y) */
  int player_y = h / 2 - PADDLE_H / 2;
  int ai_y = h / 2 - PADDLE_H / 2;

  /* Ball position and velocity (fixed-point, 8-bit fraction) */
  int ball_x = (w / 2) << 8;
  int ball_y = (h / 2) << 8;
  int ball_vx = 384; /* ~1.5 px/frame */
  int ball_vy = 256; /* ~1.0 px/frame */

  /* Scores */
  int player_score = 0;
  int ai_score = 0;

  /* Game state */
  int paused = 0;
  int game_over = 0;
  int winning_score = 5;

  keira_buzzer_play(880, 100);
  keira_delay(120);
  keira_buzzer_stop();

  for (;;) {
    uint32_t state = keira_controller_get_state();

    /* Exit */
    if (state & KEIRA_JUST_B)
      break;

    /* Pause toggle */
    if (state & KEIRA_JUST_START) {
      paused = !paused;
      if (game_over) {
        /* Restart game */
        player_score = 0;
        ai_score = 0;
        game_over = 0;
        paused = 0;
        ball_x = (w / 2) << 8;
        ball_y = (h / 2) << 8;
      }
    }

    if (!paused && !game_over) {
      /* Player input */
      if (state & KEIRA_BTN_UP) {
        player_y -= PADDLE_SPEED;
        if (player_y < 0)
          player_y = 0;
      }
      if (state & KEIRA_BTN_DOWN) {
        player_y += PADDLE_SPEED;
        if (player_y > h - PADDLE_H)
          player_y = h - PADDLE_H;
      }

      /* AI movement */
      int ball_py = ball_y >> 8;
      int ai_center = ai_y + PADDLE_H / 2;
      if (ai_center < ball_py - 5) {
        ai_y += AI_SPEED;
      } else if (ai_center > ball_py + 5) {
        ai_y -= AI_SPEED;
      }
      if (ai_y < 0)
        ai_y = 0;
      if (ai_y > h - PADDLE_H)
        ai_y = h - PADDLE_H;

      /* Ball movement */
      ball_x += ball_vx;
      ball_y += ball_vy;

      int bx = ball_x >> 8;
      int by = ball_y >> 8;

      /* Top/bottom wall bounce */
      if (by < 0) {
        ball_y = 0;
        ball_vy = abs_val(ball_vy);
        keira_buzzer_play(440, 20);
      }
      if (by >= h - BALL_SIZE) {
        ball_y = (h - BALL_SIZE) << 8;
        ball_vy = -abs_val(ball_vy);
        keira_buzzer_play(440, 20);
      }

      /* Player paddle collision (left side) */
      if (bx <= PADDLE_W + 10 && bx >= 10) {
        if (by + BALL_SIZE >= player_y && by <= player_y + PADDLE_H) {
          ball_vx = abs_val(ball_vx);
          /* Add spin based on hit position */
          int hit_pos = (by - player_y) - PADDLE_H / 2;
          ball_vy += hit_pos * 3;
          keira_buzzer_play(660, 30);
        }
      }

      /* AI paddle collision (right side) */
      if (bx + BALL_SIZE >= w - PADDLE_W - 10 && bx <= w - 10) {
        if (by + BALL_SIZE >= ai_y && by <= ai_y + PADDLE_H) {
          ball_vx = -abs_val(ball_vx);
          int hit_pos = (by - ai_y) - PADDLE_H / 2;
          ball_vy += hit_pos * 3;
          keira_buzzer_play(660, 30);
        }
      }

      /* Clamp ball velocity */
      if (ball_vy > 768)
        ball_vy = 768;
      if (ball_vy < -768)
        ball_vy = -768;

      /* Score */
      if (bx < 0) {
        ai_score++;
        ball_x = (w / 2) << 8;
        ball_y = (h / 2) << 8;
        ball_vx = -384;
        ball_vy = ((keira_millis() % 512) - 256);
        keira_buzzer_play(220, 200);
      }
      if (bx > w) {
        player_score++;
        ball_x = (w / 2) << 8;
        ball_y = (h / 2) << 8;
        ball_vx = 384;
        ball_vy = ((keira_millis() % 512) - 256);
        keira_buzzer_play(880, 200);
      }

      /* Check for game over */
      if (player_score >= winning_score || ai_score >= winning_score) {
        game_over = 1;
      }
    }

    /* Draw */
    keira_display_fill_screen(KEIRA_COLOR_BLACK);

    /* Center line */
    for (int y = 0; y < h; y += 10) {
      keira_display_fill_rect(w / 2 - 1, y, 2, 5,
                              keira_display_color565(64, 64, 64));
    }

    /* Paddles */
    keira_display_fill_rect(10, player_y, PADDLE_W, PADDLE_H,
                            KEIRA_COLOR_GREEN);
    keira_display_fill_rect(w - 10 - PADDLE_W, ai_y, PADDLE_W, PADDLE_H,
                            KEIRA_COLOR_RED);

    /* Ball */
    int bx = ball_x >> 8;
    int by = ball_y >> 8;
    keira_display_fill_rect(bx, by, BALL_SIZE, BALL_SIZE, KEIRA_COLOR_WHITE);

    /* Scores */
    keira_display_set_text_size(2);
    keira_display_set_cursor(w / 2 - 40, 10);
    keira_display_set_text_color(KEIRA_COLOR_GREEN);
    keira_display_print("0");
    keira_display_print(" ");
    {
      char buf[4];
      buf[0] = '0' + player_score;
      buf[1] = '\0';
      keira_display_print(buf);
    }

    keira_display_set_cursor(w / 2 + 20, 10);
    keira_display_set_text_color(KEIRA_COLOR_RED);
    {
      char buf[4];
      buf[0] = '0' + ai_score;
      buf[1] = '\0';
      keira_display_print(buf);
    }

    /* Pause/Game Over overlay */
    if (paused || game_over) {
      keira_display_fill_rect(w / 2 - 60, h / 2 - 20, 120, 40,
                              keira_display_color565(0, 0, 128));
      keira_display_set_cursor(w / 2 - 40, h / 2 - 10);
      keira_display_set_text_color(KEIRA_COLOR_WHITE);
      keira_display_set_text_size(1);
      if (game_over) {
        if (player_score >= winning_score) {
          keira_display_println("  YOU WIN!");
        } else {
          keira_display_println("  AI WINS!");
        }
        keira_display_set_cursor(w / 2 - 50, h / 2 + 5);
        keira_display_print("START to restart");
      } else {
        keira_display_println("   PAUSED");
      }
    }

    /* Controls hint */
    keira_display_set_cursor(5, h - 12);
    keira_display_set_text_color(keira_display_color565(80, 80, 80));
    keira_display_set_text_size(1);
    keira_display_print("UP/DN:move START:pause B:quit");

    keira_queue_draw();
    keira_delay(16);
  }

  keira_buzzer_stop();
  return 0;
}

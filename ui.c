#include "protocol.h"

str s(char *s) {
    size_t size = 0;
    while (s[size++] != '\0') {}
    return (str) {
        .p = s,
        .size = size-1,
    };
}

rect box = (rect){
    .x = 100,
    .y = 100,
    .w = 200,
    .h = 50
};

typedef enum bool {
    false = 0,
    true = 1,
}bool;

#define BACKGROUND "black"
#define FOREGROUND "white"

bool button(str text, rect boundries) {
    set_fillstyle(s(FOREGROUND));
    draw_rect(boundries);
    set_fillstyle(s(BACKGROUND));
    set_font(s("bold 24px sans"));
    draw_text(text, boundries.x+(boundries.w/2), boundries.y+boundries.h-12);
    if (is_mouse_clicked() == 1) {
        size_t x = get_mouseX();
        size_t y = get_mouseY();
        if (x <= boundries.w+boundries.x && x >= boundries.x &&
            y <= boundries.h+boundries.y && y >= boundries.y) {
            return true;
        }
    }
    return false;
}

size_t counter = 0;
str btext;

// This is the main loop
void animation_frame() {
    set_fillstyle(s(BACKGROUND));
    draw_rect((rect){
        .x = 0, .y = 0,
        .w = get_window_width(),
        .h = get_window_height(),
    });
    if (button(btext, box)) {
        counter++;
        counter = counter%10;
        *btext.p = '0' + counter;
    }
    set_fillstyle(s(FOREGROUND));
    draw_text(s("This is a demo of my wasm imgui, but it has a long way to go..."),
            50, get_window_height()/2);
}

int main() {
    btext = s("0");
    return 0;
}

typedef unsigned int size_t;

typedef struct str {
    char* p;
    size_t size;
} str;

typedef struct rect {
    size_t x, y, w, h;
} rect;

void console_log(str s);
int get_window_width();
int get_window_height();
void set_fillstyle(str style);
void set_font(str style);
void draw_rect(rect r);
void draw_text(str text, size_t x, size_t y);
size_t get_deltatime();
size_t is_mouse_clicked();
size_t get_mouseX();
size_t get_mouseY();

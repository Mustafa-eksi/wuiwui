function get_str(mem, s) {
    let dv = new DataView(mem);
    let p = dv.getUint32(s, true);
    let size = dv.getUint32(s+4, true);
    let strbuf = new Uint8Array(mem, p, size);
    return new TextDecoder().decode(strbuf);
}

function get_rect(mem, ptr) {
    let dv = new DataView(mem);
    return {
        x: dv.getUint32(ptr, true),
        y: dv.getUint32(ptr+4, true),
        w: dv.getUint32(ptr+8, true),
        h: dv.getUint32(ptr+12, true),
    };
}

async function sleep(ms) {
    await new Promise(r => setTimeout(r, ms));
}

var mouse_clicked = false;
var mouse_x = 0;
var mouse_y = 0;

async function init() {
    let canvas = document.getElementById("canwasm");
    let context = canvas.getContext("2d");
    context.canvas.width  = window.innerWidth;
    context.canvas.height = window.innerHeight;
    canvas.addEventListener('click', (e) => {
        mouse_clicked = true;
        mouse_x = e.clientX;
        mouse_y = e.clientY;
    });
    const memory = new WebAssembly.Memory({
        initial: 10,
        maximum: 100,
        shared: true,
    });
    let dt = 10;
    const { instance } = await WebAssembly.instantiateStreaming(
        fetch("./ui.wasm"),
        {
            js: { mem: memory, },
            env: {
                console_log: (s) => {
                    console.log(get_str(instance.exports.memory.buffer, s));
                },
                get_window_width: () => {
                    return context.canvas.width;
                },
                get_window_height: () => {
                    return context.canvas.height;
                },
                set_fillstyle: (style) => {
                    context.fillStyle = get_str(instance.exports.memory.buffer, style);
                },
                set_font: (font) => {
                    context.font = get_str(instance.exports.memory.buffer, font);
                },
                draw_rect: (rect) => {
                    let r = get_rect(instance.exports.memory.buffer, rect);
                    context.fillRect(r.x, r.y, r.w, r.h);
                },
                draw_text: (text, x, y) => {
                    let str = get_str(instance.exports.memory.buffer, text);
                    context.fillText(str, x, y);
                },
                get_deltatime: () => {
                    return Math.min(dt, 10);
                },
                is_mouse_clicked: () => {
                    if (mouse_clicked) {
                        mouse_clicked = false;
                        return 1;
                    }
                    return 0;
                },
                get_mouseX: () => {
                    return mouse_x;
                },
                get_mouseY: () => {
                    return mouse_y;
                },
            },
        }
    );
    console.log("Output: ", instance.exports.main());
    let prev = 0;
    const af = (t) => {
        dt = t - prev;
        instance.exports.animation_frame();
        window.requestAnimationFrame(af);
    }
    window.requestAnimationFrame(af);
}

window.onload = init;

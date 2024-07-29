#!/usr/bin/fish

 clang \
   --target=wasm32 \
   -O3 \
   -flto \
   -nostdlib \
   -Wl,--no-entry \
   -Wl,--export-all \
   -Wl,--lto-O3 \
   -Wl,--allow-undefined \
   #   -Wl,-z,stack-size=$[8 * 1024 * 1024] \
   -o ui.wasm \
   ui.c


# egret_flvjs_player
a demo of flvjs x egret engine

## How to demo?
### Windows
- open with vscode
- press F5

---

## Workflow
- use `flvjs` generally, but is not necessary to append the `<video>` to the `<document>`
- create a `<canvas>` to convert `<video>` data
- then looping:
  - convert(darw) the `<video>`  to the `<canvas>`
  - create `egret.BitmapData` by the `<canvas>`
  - create `egret.Texture` by the `egret.BitmapData`
  - assign the `egret.Texture` to the display object(eg. `egret.Bitmap`, `eui.image`)
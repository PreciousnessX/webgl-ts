import "./style/index.scss";

const warp: HTMLElement = <HTMLElement>document.getElementById("warp");
const rect: DOMRect = <DOMRect>warp.getBoundingClientRect();

// 创建一个canvas append到warp 容器中
const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.createElement("canvas")
);
warp.appendChild(canvas);
canvas.height = rect.height;
canvas.width = rect.width;

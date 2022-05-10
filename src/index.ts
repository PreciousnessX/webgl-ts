import "./style/index.scss";
import { createShader } from "./gl";

const warp: HTMLElement = document.getElementById("warp");
const rect: DOMRect = warp.getBoundingClientRect();

// 创建一个canvas append到warp 容器中
const canvas: HTMLCanvasElement = document.createElement("canvas");
warp.appendChild(canvas);
canvas.height = rect.height;
canvas.width = rect.width;

const gl: WebGLRenderingContext = canvas.getContext("webgl");
console.log(gl);
console.log(createShader);

// 使用createShaer 创建两个着色器

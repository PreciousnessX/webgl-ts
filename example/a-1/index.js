import './style/index.scss';
import { createShader, createProgram } from './gl';
import cubeShader from './shaders/cube/vertex.glsl';
import cubFragMent from './shaders/cube/fragment.glsl';
import * as webglUtils from './webglUtils';

const warp = document.getElementById('warp');
const rect = warp.getBoundingClientRect();

// 创建一个canvas append到warp 容器中
const canvas = document.createElement('canvas');
warp.appendChild(canvas);
canvas.height = rect.height;
canvas.width = rect.width;

const gl = canvas.getContext('webgl');

// 1, 使用createShaer 创建两个着色器
const vertexShader = createShader(gl, gl.VERTEX_SHADER, cubeShader);

const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, cubFragMent);

// 2, 创建着色器程序
const program = createProgram(gl, vertexShader, fragmentShader);

// 3, 为着色器程序提供数据
// 3.a 属性值需要从缓冲区中获取数据  所以需要创建一个缓冲 并将缓存区 绑定给gl
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// 3.b 通过绑定点向缓冲中存放数据
const position = [0, 0, 0, 0.5, 0.7, 0];
gl.bufferData(
	gl.ARRAY_BUFFER,
	new Float32Array(position),
	gl.STATIC_DRAW // 提示webgl我们不会经常改变这些数据
);

// 4, 在绘制之前我们应该调整画布（canvas）的尺寸以匹配它的显示尺寸
webglUtils.resize(gl.canvas);
// 我们需要告诉WebGL怎样把提供的gl_Position裁剪空间坐标对应到画布像素坐标，
// 通常我们也把画布像素坐标叫做屏幕空间。为了实现这个目的，
// 我们只需要调用gl.viewport 方法并传递画布的当前尺寸。
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// 5, 绘制
// 清空画布
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
// 告诉它用我们之前写好的着色程序（一个着色器对）
gl.useProgram(program);

// 3.a 拿到变量 a_position 属性内存所在的位置
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

//告诉WebGL怎么从我们之前准备的缓冲中获取数据给着色器中的属性。 首先我们需要启用对应属性
gl.enableVertexAttribArray(positionAttributeLocation);

// 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
const size = 2; // 每次迭代运行提取两个单位数据
const type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
const normalize = false; // 不需要归一化数据
const stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
// 每次迭代运行运动多少内存到下一个数据开始点
const offset = 0; // 从缓冲起始位置开始读取
// 告诉显卡从当前绑定的缓冲区（bindBuffer()指定的缓冲区）中读取顶点数据
gl.vertexAttribPointer(
	// 这一步 才将 gl中的缓冲区数据 交给shader的a_position 变量
	positionAttributeLocation,
	size,
	type,
	normalize,
	stride,
	offset
);

// 6, 运行着色器程序
const primitiveType = gl.TRIANGLES;
gl.drawArrays(primitiveType, 0, 3);

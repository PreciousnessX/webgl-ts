import './style/index.scss';
import './style/webgl-tutorials.css';
// import { createShader, createProgram } from './gl';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const webglUtils = require('../../src/utils/webgl-utils');
// const webglLessonsUI = require('../../src/utils/webgl-lessons-ui');
// const m3 = require('../../src/utils/m3');

function main() {
	const image = new Image();
	image.src = 'assets/images/leaves.jpg'; // MUST BE SAME DOMAIN!!! // 必须是同一域名
	image.onload = function () {
		render(image);
	};
}

function render(image) {
	// Get A WebGL context
	/** @type {HTMLCanvasElement} */
	const canvas = document.querySelector('#canvas');
	const gl = canvas.getContext('webgl');
	if (!gl) {
		return;
	}

	// setup GLSL program
	const program = webglUtils.createProgramFromSources(gl, [
		vertexShader,
		fragmentShader,
	]);

	// look up where the vertex data needs to go.
	const positionLocation = gl.getAttribLocation(program, 'a_position');
	const texcoordLocation = gl.getAttribLocation(program, 'a_texCoord');

	// Create a buffer to put three 2d clip space points in
	const positionBuffer = gl.createBuffer();

	// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	// Set a rectangle the same size as the image.
	setRectangle(gl, 0, 0, image.width, image.height);

	// provide texture coordinates for the rectangle.
	const texcoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
		]),
		// new Float32Array([1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1]), // 镜像
		// new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]), // 反转
		gl.STATIC_DRAW
	);

	// Create a texture.
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Set the parameters so we can render any size image.
	// 设置纹理参数
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // 纹理水平填充
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // 纹理垂直填充
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // 纹理缩小滤波器
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // 纹理放大滤波器

	// Upload the image into the texture.
	// 将图片载入到文字中
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

	// lookup uniforms
	const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

	webglUtils.resizeCanvasToDisplaySize(gl.canvas);

	// Tell WebGL how to convert from clip space to pixels
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Clear the canvas
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Tell it to use our program (pair of shaders)
	gl.useProgram(program);

	// Turn on the position attribute
	gl.enableVertexAttribArray(positionLocation);

	// Bind the position buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	gl.vertexAttribPointer(
		positionLocation,
		2, // size; components per iteration 每个点需要2个数据
		gl.FLOAT, //type;  the data is 32bit floats
		false, // normalize; don't normalize the data 不标准化数据
		0, // stride; 0 = move forward size * sizeof(type) each iteration to get the next position // 跳步
		0 // offset; // start at the beginning of the buffer // 偏移量
	);

	// Turn on the texcoord attribute
	gl.enableVertexAttribArray(texcoordLocation);

	// bind the texcoord buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

	// Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
	gl.vertexAttribPointer(
		texcoordLocation,
		2, // size; components per iteration 每个点需要2个数据
		gl.FLOAT, //type;  the data is 32bit floats
		false, // normalize; don't normalize the data 不标准化数据
		0, // stride; 0 = move forward size * sizeof(type) each iteration to get the next position // 跳步
		0 // offset; // start at the beginning of the buffer // 偏移量
	);

	// set the resolution
	gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

	// Draw the rectangle.
	const primitiveType = gl.TRIANGLES;
	const offset = 0;
	const count = 6;
	gl.drawArrays(primitiveType, offset, count);
}

function setRectangle(gl, x, y, width, height) {
	const x1 = x;
	const x2 = x + width;
	const y1 = y;
	const y2 = y + height;
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
		gl.STATIC_DRAW
	);
}

main();

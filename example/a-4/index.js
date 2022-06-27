import './style/index.scss';
import './style/webgl-tutorials.css';
// import { createShader, createProgram } from './gl';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const webglUtils = require('../../src/utils/webgl-utils');
const webglLessonsUI = require('../../src/utils/webgl-lessons-ui');
const m3 = require('../../src/utils/m3');

// Get A WebGL context
/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#canvas');
const gl = canvas.getContext('webgl');

// setup GLSL program
const program = webglUtils.createProgramFromSources(gl, [
	vertexShader,
	fragmentShader,
]);

// look up where the vertex data needs to go.
const positionLocation = gl.getAttribLocation(program, 'a_position');
const colorLocation = gl.getAttribLocation(program, 'a_color');

// lookup uniforms
const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

// Create a buffer for the positions.
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// Set Geometry.
setGeometry(gl);

// Create a buffer for the colors.
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// Set the colors.
setColors(gl);

const translation = [200, 150];
let angleInRadians = 0;
const scale = [1, 1];

drawScene();

// Setup a ui.
webglLessonsUI.setupSlider('#x', {
	value: translation[0],
	slide: updatePosition(0),
	max: gl.canvas.width,
});
webglLessonsUI.setupSlider('#y', {
	value: translation[1],
	slide: updatePosition(1),
	max: gl.canvas.height,
});
webglLessonsUI.setupSlider('#angle', { slide: updateAngle, max: 360 });
webglLessonsUI.setupSlider('#scaleX', {
	value: scale[0],
	slide: updateScale(0),
	min: -5,
	max: 5,
	step: 0.01,
	precision: 2,
});
webglLessonsUI.setupSlider('#scaleY', {
	value: scale[1],
	slide: updateScale(1),
	min: -5,
	max: 5,
	step: 0.01,
	precision: 2,
});

function updatePosition(index) {
	return function (event, ui) {
		translation[index] = ui.value;
		drawScene();
	};
}

function updateAngle(event, ui) {
	const angleInDegrees = 360 - ui.value;
	angleInRadians = (angleInDegrees * Math.PI) / 180;
	drawScene();
}

function updateScale(index) {
	return function (event, ui) {
		scale[index] = ui.value;
		drawScene();
	};
}

// Draw the scene.
function drawScene() {
	webglUtils.resizeCanvasToDisplaySize(gl.canvas);

	// Tell WebGL how to convert from clip space to pixels
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Clear the canvas.
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Tell it to use our program (pair of shaders)
	gl.useProgram(program);

	// Turn on the position attribute
	gl.enableVertexAttribArray(positionLocation);

	// Bind the position buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	// 告诉position属性如何从positionBuffer（ARRAY\u BUFFER）中获取数据
	gl.vertexAttribPointer(
		positionLocation,
		2, // size; components per iteration 每个点需要2个数据
		gl.FLOAT, //type;  the data is 32bit floats
		false, // normalize; don't normalize the data 不标准化数据
		0, // stride; 0 = move forward size * sizeof(type) each iteration to get the next position // 跳步
		0 // offset; // start at the beginning of the buffer // 偏移量
	);

	// Turn on the color attribute
	gl.enableVertexAttribArray(colorLocation);

	// Bind the color buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

	// Tell the color attribute how to get data out of colorBuffer (ARRAY_BUFFER)
	// 告诉颜色属性如何从colorBuffer（ARRAY\u BUFFER）中获取数据
	gl.vertexAttribPointer(
		colorLocation,
		4, // size; components per iteration 每个点需要2个数据
		gl.FLOAT, //type;  the data is 32bit floats
		false, // normalize; don't normalize the data 不标准化数据
		0, // stride; 0 = move forward size * sizeof(type) each iteration to get the next position // 跳步
		0 // offset; // start at the beginning of the buffer // 偏移量
	);

	// Compute the matrix
	let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
	matrix = m3.translate(matrix, translation[0], translation[1]);
	matrix = m3.rotate(matrix, angleInRadians);
	matrix = m3.scale(matrix, scale[0], scale[1]);

	// Set the matrix.
	gl.uniformMatrix3fv(matrixLocation, false, matrix);

	// Draw the geometry.
	const primitiveType = gl.TRIANGLES;
	const offset = 0;
	const count = 6;
	gl.drawArrays(primitiveType, offset, count);
}

// Fill the buffer with the values that define a rectangle.
// Note, will put the values in whatever buffer is currently
// bound to the ARRAY_BUFFER bind point
function setGeometry(gl) {
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			-150, -100, 150, -100, -150, 100, 150, -100, -150, 100, 150, 100,
		]),
		gl.STATIC_DRAW
	);
}

// Fill the buffer with colors for the 2 triangles
// that make the rectangle.
// Note, will put the values in whatever buffer is currently
// bound to the ARRAY_BUFFER bind point
function setColors(gl) {
	// Make every vertex a different color.
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			Math.random(),
			Math.random(),
			Math.random(),
			1,
			Math.random(),
			Math.random(),
			Math.random(),
			1,
			Math.random(),
			Math.random(),
			Math.random(),
			1,
			Math.random(),
			Math.random(),
			Math.random(),
			1,
			Math.random(),
			Math.random(),
			Math.random(),
			1,
			Math.random(),
			Math.random(),
			Math.random(),
			1,
		]),
		gl.STATIC_DRAW
	);
}

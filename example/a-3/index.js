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

// Fill the buffer with the values that define a triangle.
// Note, will put the values in whatever buffer is currently
// bound to the ARRAY_BUFFER bind point
function setGeometry(gl) {
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([0, -100, 150, 125, -175, 100]),
		gl.STATIC_DRAW
	);
}

// setup GLSL program
const program = webglUtils.createProgramFromSources(gl, [
	vertexShader,
	fragmentShader,
]);

// look up where the vertex data needs to go.
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

// lookup uniforms
const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

// Create a buffer.
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Set Geometry.
setGeometry(gl);

const translation = [200, 150];
let angleInRadians = 0;
const scale = [1, 1];

drawScene();
// Draw the scene.
function drawScene() {
	webglUtils.resizeCanvasToDisplaySize(gl.canvas);

	// Tell WebGL how to convert from clip space to pixels
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Clear the canvas.
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Tell it to use our program (pair of shaders)
	gl.useProgram(program);

	// Turn on the attribute
	gl.enableVertexAttribArray(positionAttributeLocation);

	// Bind the position buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	const size = 2; // 2 components per iteration
	const type = gl.FLOAT; // the data is 32bit floats
	const normalize = false; // don't normalize the data
	const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
	const offset = 0; // start at the beginning of the buffer
	gl.vertexAttribPointer(
		positionAttributeLocation,
		size,
		type,
		normalize,
		stride,
		offset
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
	const count = 3;
	gl.drawArrays(primitiveType, offset, count);
}

/********** 设置ui操作 ***********/
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

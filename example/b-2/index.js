'use strict';
import './style/index.scss';
import './style/webgl-tutorials.css';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const webglUtils = require('../../src/utils/webgl-utils');
const webglLessonsUI = require('../../src/utils/webgl-lessons-ui');
// const m3 = require('../../src/utils/m3');

const { $ } = window;

function main() {
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

	// lookup uniforms
	const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
	const colorLocation = gl.getUniformLocation(program, 'u_color');
	const translationLocation = gl.getUniformLocation(program, 'u_translation');
	const rotationLocation = gl.getUniformLocation(program, 'u_rotation');

	// Create a buffer to put positions in
	const positionBuffer = gl.createBuffer();
	// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	// Put geometry data into buffer
	setGeometry(gl);

	const translation = [100, 150];
	const rotation = [0, 1];
	const color = [Math.random(), Math.random(), Math.random(), 1];

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
	$('#rotation').gmanUnitCircle({
		width: 200,
		height: 200,
		value: 0,
		slide(e, u) {
			rotation[0] = u.x;
			rotation[1] = u.y;
			drawScene();
		},
	});

	function updatePosition(index) {
		return function (event, ui) {
			translation[index] = ui.value;
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

		// Turn on the attribute
		gl.enableVertexAttribArray(positionLocation);

		// Bind the position buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
		const size = 2; // 2 components per iteration
		const type = gl.FLOAT; // the data is 32bit floats
		const normalize = false; // don't normalize the data
		const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
		gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, 0);

		// set the resolution
		gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

		// set the color
		gl.uniform4fv(colorLocation, color);

		// Set the translation.
		gl.uniform2fv(translationLocation, translation);

		// Set the rotation.
		gl.uniform2fv(rotationLocation, rotation);

		// Draw the geometry.
		const primitiveType = gl.TRIANGLES;
		const count = 18; // 6 triangles in the 'F', 3 points per triangle
		gl.drawArrays(primitiveType, 0, count);
	}
}

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			// left column
			0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150,

			// top rung
			30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30,

			// middle rung
			30, 60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90,
		]),
		gl.STATIC_DRAW
	);
}

$(function () {
	main();
});

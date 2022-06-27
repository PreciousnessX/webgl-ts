// 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
export function createShader(gl, type, source) {
	const shader = gl.createShader(type); // 创建着色器对象
	gl.shaderSource(shader, source); // 载入源码
	gl.compileShader(shader); // 编译 -> 生成着色器
	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
		return shader;
	}

	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

/**
 * 着色器程序
 * @param gl WebGL2RenderingContext
 * @param vertexShader WebGLShader
 * @param fragmentShader WebGLShader
 * @returns WebGLProgram
 */
export function createProgram(gl, vertexShader, fragmentShader) {
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	const success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
		return program;
	}

	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}

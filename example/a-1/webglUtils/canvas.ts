export function resize(canvas: HTMLCanvasElement): void {
	// 获取浏览器中画布的显示尺寸
	const displayWidth = canvas.clientWidth;
	const displayHeight = canvas.clientHeight;

	// 检尺寸是否相同
	if (canvas.width != displayWidth || canvas.height != displayHeight) {
		// 设置为相同的尺寸
		canvas.width = displayWidth;
		canvas.height = displayHeight;
	}
}

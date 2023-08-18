/**svgElement -> string -> blob -> url */
const svgToBlobUrl = (svgElement: SVGSVGElement) => {
	// 获取svg代码
	const svgData = new XMLSerializer().serializeToString(svgElement)
	// 创建一个Blob对象，内容为svg代码
	const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
	return URL.createObjectURL(blob)
}

export const downloadSVG = (svgElement: SVGSVGElement, name: string) => {
	const url = svgToBlobUrl(svgElement)

	// 创建一个a标签用于下载
	const downloadLink = document.createElement('a')
	downloadLink.href = url
	downloadLink.download = name

	// 触发点击事件开始下载
	document.body.appendChild(downloadLink)
	downloadLink.click()
	document.body.removeChild(downloadLink)
}

export const downloadSvgToImg = (svgElement: SVGSVGElement, name: string, rate: number = 2) => {
	const img = new Image()
	const url = svgToBlobUrl(svgElement)

	let { width, height } = svgElement.getBoundingClientRect()
    width *= rate
    height *= rate

	img.onload = function () {
		// 创建canvas，绘制并导出图像
		const canvas = document.createElement('canvas')
		canvas.width = width
		canvas.height = height
		const ctx = canvas.getContext('2d')!
		ctx.drawImage(img, 0, 0, width, height)

		// 导出图像数据
		var pngData = canvas.toDataURL('image/png')

		// 创建下载链接并触发下载
		var downloadLink = document.createElement('a')
		downloadLink.href = pngData
		downloadLink.download = name + '.png'

		document.body.appendChild(downloadLink)
		downloadLink.click()
		document.body.removeChild(downloadLink)

		// 清理URL对象
		URL.revokeObjectURL(url)
	}

	img.src = url
}

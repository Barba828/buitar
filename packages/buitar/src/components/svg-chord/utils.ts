import { Point } from '@buitar/to-guitar'
import { SvgChordPoint } from '@buitar/svg-chord'

/**
 * ToGuitar.Point => SvgChord.Point
 * @param point
 * @returns
 */
export const transToSvgPoint = (point: Point): SvgChordPoint => {
	return {
		fret: point.grade,
		string: point.string,
		tone: point.note,
	}
}

/**
 * ToGuitar.Point[] => SvgChord.Point[]
 * @param points
 * @param stringNums 弦数
 * @returns
 */
export const transToSvgPoints = (points: Point[], stringNums: number = 6): SvgChordPoint[] => {
	const svgPoints = points.map(transToSvgPoint)
	return makeUpGuitarPoints(svgPoints, stringNums)
}

/**
 * 补全String数
 */
export const makeUpGuitarPoints = (points: SvgChordPoint[], num: number): SvgChordPoint[] => {
	return new Array(num).fill(0).map((_, index) => {
		const idx = points.findIndex((point) => point.string === index + 1)
		if (idx === -1) {
			return {
				fret: -1,
				string: index + 1,
			}
		} else {
			return points[idx]
		}
	})
}

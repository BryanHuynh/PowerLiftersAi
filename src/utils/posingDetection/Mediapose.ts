import { DrawingUtils } from '@mediapipe/tasks-vision'
import PosingStrategy from './PosingStrategy'

export const MediaPose: PosingStrategy = {
	initalize: function (): void {
		throw new Error('Function not implemented.')
	},
	detectAndDraw: function (
		drawingUtils: DrawingUtils,
		ctx: CanvasRenderingContext2D
	): void {
		throw new Error('Function not implemented.')
	}
}

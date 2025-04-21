import {
	DrawingUtils,
	FilesetResolver,
	PoseLandmarker,
	PoseLandmarkerResult
} from '@mediapipe/tasks-vision'
import PosingStrategy from './PosingStrategy'

export class MediaPose implements PosingStrategy {
	private wasmUrl: string =
		'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm'
	private modelAssetPath: string =
		'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task'

	private _poseLandmarker: PoseLandmarker | undefined;
	private _lastVideoTime: number

	constructor() {
		this._lastVideoTime = 0
	}

	async initalize(): Promise<void> {
		await PoseLandmarker.createFromOptions(
			await FilesetResolver.forVisionTasks(this.wasmUrl),
			{
				baseOptions: {
					modelAssetPath: this.modelAssetPath,
					delegate: 'GPU'
				},
				// outputSegmentationMasks: true, // We will draw the face mesh in canvas.
				runningMode: 'VIDEO',
				numPoses: 1
			}
		).then((poseLandmarker) => {
			this._poseLandmarker = poseLandmarker
		})
	}

	detectAndDraw(
		drawingUtils: DrawingUtils,
		ctx: CanvasRenderingContext2D,
		videoRef: HTMLVideoElement
	): void {
		if (!this._poseLandmarker) {
			this.initalize()
		}
		let landMarkerResults: PoseLandmarkerResult | undefined
		const startTimeMs = performance.now()
		if (this._lastVideoTime != videoRef.currentTime) {
			this._lastVideoTime = videoRef.currentTime
			landMarkerResults = this._poseLandmarker?.detectForVideo(
				videoRef,
				startTimeMs
			)
		}
		if (!landMarkerResults) return

		ctx.save()
		const landmarks = landMarkerResults.landmarks
		for (const landmark of landmarks) {
			drawingUtils.drawLandmarks(landmark, {
				radius: (data) =>
					DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1)
			})
			drawingUtils.drawConnectors(
				landmark,
				PoseLandmarker.POSE_CONNECTIONS
			)
		}
		ctx.restore()
	}
}

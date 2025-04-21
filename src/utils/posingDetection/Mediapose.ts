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

	private _poseLandmarker: PoseLandmarker
	private _lastVideoTime: number

	constructor() {
		this._lastVideoTime = -1
		this.initalize()
	}

	async initalize(): Promise<void> {
		console.log('initalizing media pose')
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

	detectAndDraw(canvas: HTMLCanvasElement, video: HTMLVideoElement): void {
		if (!canvas || !video) throw new Error('canvas or video is null')

		if (!this._poseLandmarker) {
			this.initalize()
		}
		const ctx = canvas.getContext('2d')
		if (!ctx) {
			return
		}

		const drawingUtils = new DrawingUtils(ctx)

		const timestamp = performance.now()
		const landMarkerResults: PoseLandmarkerResult =
			this._poseLandmarker?.detectForVideo(video, timestamp)

		if (!landMarkerResults) {
			return
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height)
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

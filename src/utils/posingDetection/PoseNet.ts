import * as poseDetection from '@tensorflow-models/pose-detection'
import PosingStrategy from './PosingStrategy'
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm'
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs-core'
tfjsWasm.setWasmPaths(
	`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`
)

export class PoseNet implements PosingStrategy {
	private _detector: poseDetection.PoseDetector
	private _constructorLock: boolean = false

	constructor() {
		this.initalize()
	}

	async initalize() {
		if (this._constructorLock) {
			return
		}
		this._constructorLock = true
		await tf.setBackend('webgl')
		await tf.ready()
		console.log(`Using TF backend: ${tf.getBackend()}`)
		const modelType = poseDetection.movenet.modelType.SINGLEPOSE_THUNDER
		const detectorConfig = {
			modelType: modelType
		}

        this._detector = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet,
            detectorConfig
        )


		this._constructorLock = false
	}

	async detectAndDraw(
		canvas: HTMLCanvasElement,
		video: HTMLVideoElement
	): Promise<void> {
		if (!canvas || !video) throw new Error('canvas or video is null')
		if (video.readyState < 2) throw new Error('video element not ready')
		if (this._detector == null) {
			if (this._constructorLock) {
				return
			}
			await this.initalize()
		}
		const ctx = canvas.getContext('2d')
		if (!ctx) {
			throw new Error('canvas context is null')
		}
		const poses: poseDetection.Pose[] = await this._detector.estimatePoses(
			video
		)
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.save()
		for (const pose of poses) {
			const keypoints = pose.keypoints
			this.drawPoints(keypoints, ctx)
			this.drawSkeleton(keypoints, ctx)
		}

		ctx.restore()
	}

	drawPoints(
		keypoints: poseDetection.Keypoint[],
		ctx: CanvasRenderingContext2D
	) {
		for (const keypoint of keypoints) {
			const circle = new Path2D()
			circle.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI)
			ctx.fillStyle = 'red'
			ctx.fill(circle)
		}
		
	}

	drawSkeleton(
		keypoints: poseDetection.Keypoint[],
		ctx: CanvasRenderingContext2D
	) {
		const LINE_WIDTH = 2
		ctx.fillStyle = 'White'
		ctx.strokeStyle = 'White'
		ctx.lineWidth = LINE_WIDTH

		// Get the adjacent keypoint pairs for the MoveNet model.
		const adjacentPairs = poseDetection.util.getAdjacentPairs(
			poseDetection.SupportedModels.MoveNet
		)

		for (const [i, j] of adjacentPairs) {
			const kp1 = keypoints[i]
			const kp2 = keypoints[j]
			if (kp1 && kp2) {
				ctx.beginPath()
				ctx.moveTo(kp1.x, kp1.y)
				ctx.lineTo(kp2.x, kp2.y)
				ctx.stroke()
			} else {
				console.log(i, j)
			}
		}
	}
}

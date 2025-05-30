import {
	forwardRef,
	SetStateAction,
	useEffect,
	useImperativeHandle,
	useRef,
	useState
} from 'react'
import { Camera } from '@capacitor/camera'
import './VideoCapture.css'
import {
	DrawingUtils,
	PoseLandmarker,
	FilesetResolver,
	PoseLandmarkerResult
} from '@mediapipe/tasks-vision'
import { Capacitor } from '@capacitor/core'

export interface VideoCaptureHandle {
	startRecording: () => void
	stopRecording: () => void
	startTracking: () => void
	stopTracking: () => void
}

interface VideoCameraProps {
	deviceId: string
	onRecordingFinished: (blob: Blob) => void
}

const VideoCapture = forwardRef<VideoCaptureHandle, VideoCameraProps>(
	({ deviceId, onRecordingFinished }, ref) => {
		const videoRef = useRef<HTMLVideoElement | null>(null)
		const canvasRef = useRef<HTMLCanvasElement | null>(null)
		const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null)
		const streamRef = useRef<MediaStream | null>(null)
		const poseLandmarkerRef = useRef<PoseLandmarker>(null)
		const mediaRecorderRef = useRef<MediaRecorder | null>(null)
		const recordedChunksRef = useRef<Blob[]>([])
		const trackingOverlayRef = useRef<boolean>(false)

		const wasmUrl: string =
			'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm'
		const modelAssetPath: string =
			'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task'

		const startPoselandmarker = async () => {
			return await PoseLandmarker.createFromOptions(
				await FilesetResolver.forVisionTasks(wasmUrl),
				{
					baseOptions: {
						modelAssetPath: modelAssetPath,
						delegate: 'GPU'
					},
					// outputSegmentationMasks: true, // We will draw the face mesh in canvas.
					runningMode: 'VIDEO',
					numPoses: 1
				}
			)
		}

		async function requestPermissions() {
			await Camera.requestPermissions()
		}

		const displayVideoDetections = (
			result: PoseLandmarkerResult,
			drawingUtils: DrawingUtils,
			canvasCtx: CanvasRenderingContext2D
		) => {
			canvasCtx.save()
			const landmarks = result.landmarks
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
			canvasCtx.restore()
		}

		const startTracking = async () => {
			let lastVideoTime = -1
			if (
				canvasRef.current &&
				videoRef.current &&
				canvasCtxRef.current &&
				poseLandmarkerRef.current
			) {
				const drawingUtils = new DrawingUtils(canvasCtxRef.current)
				resizeCanvasToVideo()
				const startTimeMs = performance.now()
				if (lastVideoTime != videoRef.current.currentTime) {
					lastVideoTime = videoRef.current.currentTime
					if (trackingOverlayRef && trackingOverlayRef.current) {
						const landMarkerResults =
							poseLandmarkerRef.current.detectForVideo(
								videoRef.current,
								startTimeMs
							)
						displayVideoDetections(
							landMarkerResults,
							drawingUtils,
							canvasCtxRef.current
						)
					}
				}

				window.requestAnimationFrame(startTracking)
			}
		}

		const resizeCanvasToVideo = () => {
			if (canvasRef.current && videoRef.current) {
				canvasRef.current.width =
					videoRef.current.getBoundingClientRect().width
				canvasRef.current.height =
					videoRef.current.getBoundingClientRect().height
			}
		}

		const startWebcam = async () => {
			if (Capacitor.getPlatform() == 'android') {
				await requestPermissions()
			}

			const constraints: MediaStreamConstraints = {
				video: {
					deviceId: { exact: deviceId },
					width: { ideal: 4096 },
					height: { ideal: 2160 }
				}
			}

			const stream = await navigator.mediaDevices
				.getUserMedia(constraints)
			if (videoRef.current) {
				videoRef.current.srcObject = stream
			}
			streamRef.current = stream
		}

		const stopWebcam = () => {
			if (videoRef.current) {
				videoRef.current.srcObject = null
			}
			if (streamRef.current) {
				const tracks = streamRef.current.getTracks()
				tracks.forEach((track) => {
					track.stop()
					streamRef.current?.removeTrack(track)
				})

				streamRef.current = null
			}
		}

		useEffect(() => {
			stopWebcam()
			const intialize = async () => {
				if (canvasRef.current) {
					canvasCtxRef.current = canvasRef.current.getContext('2d')
				}
				poseLandmarkerRef.current = await startPoselandmarker()
				startWebcam()
				if (videoRef.current) {
					videoRef.current.addEventListener(
						'loadeddata',
						startTracking
					)
				}
			}
			intialize()
			return () => {
				stopWebcam()
			}
		}, [deviceId])

		const _stopRecording = () => {
			if (
				mediaRecorderRef.current &&
				mediaRecorderRef.current.state === 'recording'
			) {
				console.log('Stopping recording...')
				mediaRecorderRef.current.stop() // This triggers the 'onstop' event handler
			} else {
				console.warn(
					"Cannot stop recording: No active recorder found or recorder not in 'recording' state."
				)
			}
		}

		const _startRecording = () => {
			if (streamRef.current) {
				recordedChunksRef.current = []
				const recorder = new MediaRecorder(streamRef.current, {
					mimeType: 'video/webm;codecs=vp9'
				})
				mediaRecorderRef.current = recorder

				recorder.ondataavailable = (event) => {
					if (event.data.size > 0) {
						recordedChunksRef.current.push(event.data)
					}
				}

				recorder.onstop = () => {
					console.log('Recording stopped')
					const blob = new Blob(recordedChunksRef.current, {
						type: 'video/webm'
					})
					onRecordingFinished(blob)
				}

				recorder.start()
			}
		}

		const _startTrackingOverlay = () => {
			trackingOverlayRef.current = true
		}

		const _stopTrackingOverlay = () => {
			trackingOverlayRef.current = false
		}

		useImperativeHandle(ref, () => ({
			startRecording: _startRecording,
			stopRecording: _stopRecording,
			startTracking: _startTrackingOverlay,
			stopTracking: _stopTrackingOverlay
		}))

		return (
			<div className="container">
				<canvas
					className="media-preview"
					id="canvas-preview"
					ref={canvasRef}
				></canvas>
				<video
					className="media-preview"
					id="camera-preview"
					ref={videoRef}
					autoPlay
					playsInline
				></video>
			</div>
		)
	}
)

export default VideoCapture

import { useEffect, useRef, useState } from 'react'
import { Camera } from '@capacitor/camera'
import './VideoCapture.css'
import { DrawingUtils, PoseLandmarker, FilesetResolver, PoseLandmarkerResult, FaceLandmarker } from '@mediapipe/tasks-vision'
import { Capacitor } from '@capacitor/core'

interface VideoCameraProps {
	deviceId: string
	trackingOverlayRef: React.RefObject<boolean>
	isRecording: boolean
}

const VideoCapture: React.FC<VideoCameraProps> = ({ deviceId, trackingOverlayRef, isRecording }) => {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null)
	const streamRef = useRef<MediaStream | null>(null)
	const poseLandmarkerRef = useRef<PoseLandmarker>(null)
	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const recordedChunksRef = useRef<Blob[]>([])

	const wasmUrl: string = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm'
	const modelAssetPath: string = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task'

	const startPoselandmarker = async () => {
		return await PoseLandmarker.createFromOptions(await FilesetResolver.forVisionTasks(wasmUrl), {
			baseOptions: {
				modelAssetPath: modelAssetPath,
				delegate: 'GPU'
			},
			outputSegmentationMasks: true, // We will draw the face mesh in canvas.
			runningMode: 'VIDEO'
		})
	}

	async function requestPermissions() {
		const status = await Camera.requestPermissions()
		console.log('VIDEO CAPTURE:', status.camera, navigator.mediaDevices)
	}

	const displayVideoDetections = (result: PoseLandmarkerResult, drawingUtils: DrawingUtils, canvasCtx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
		if (trackingOverlayRef.current) {
			canvasCtx.save()
			// canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
			const landmarks = result.landmarks
			// console.log('Shoulder', landmarks[0][12])
			// console.log('elbow', landmarks[0][14])
			for (const landmark of landmarks) {
				drawingUtils.drawLandmarks(landmark, {
					radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1)
				})
				drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS)
			}
			canvasCtx.restore()
		}
	}

	const startTracking = async () => {
		let lastVideoTime = -1
		if (canvasRef.current && videoRef.current && canvasCtxRef.current && poseLandmarkerRef.current) {
			const drawingUtils = new DrawingUtils(canvasCtxRef.current)
			resizeCanvasToVideo()
			const startTimeMs = performance.now()
			if (lastVideoTime != videoRef.current.currentTime) {
				lastVideoTime = videoRef.current.currentTime
				const landMarkerResults = poseLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs)
				displayVideoDetections(landMarkerResults, drawingUtils, canvasCtxRef.current, canvasRef.current)
			}

			window.requestAnimationFrame(startTracking)
		}
	}

	const resizeCanvasToVideo = () => {
		if (canvasRef.current && videoRef.current) {
			canvasRef.current.width = videoRef.current.getBoundingClientRect().width
			canvasRef.current.height = videoRef.current.getBoundingClientRect().height
		}
	}

	const startWebcam = async () => {
		if (Capacitor.getPlatform() == 'android') {
			await requestPermissions()
		}

		const constraints: MediaStreamConstraints = {
			video: {
				deviceId: { exact: deviceId }
			}
		}
		const stream = await navigator.mediaDevices.getUserMedia(constraints)
		console.log('VideoCapture.tsx: loaded device: ', stream.id)
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

	const startRecording = () => {
		if (streamRef.current) {
			recordedChunksRef.current = []
			const recorder = new MediaRecorder(streamRef.current)
			mediaRecorderRef.current = recorder

			recorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					recordedChunksRef.current.push(event.data)
				}
			}

			recorder.onstop = () => {
				console.log('Recording stopped')
				const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
				const url = URL.createObjectURL(blob)
				const a = document.createElement('a')
				a.href = url
				a.download = 'recorded-video.webm'
				a.click()
				URL.revokeObjectURL(url)
			}

			recorder.start()
		}
	}

	useEffect(() => {
		stopWebcam()
		console.log('VideoCamera.tsx: camera device id: ', deviceId)
		const intialize = async () => {
			if (canvasRef.current) {
				canvasCtxRef.current = canvasRef.current.getContext('2d')
			}
			poseLandmarkerRef.current = await startPoselandmarker()
			startWebcam()
			if (videoRef.current) {
				videoRef.current.addEventListener('loadeddata', startTracking)
			}
		}
		intialize()
		return () => {
			console.log('VideoCapture.tsx: unloaded component')
			stopWebcam()
		}
	}, [deviceId])

	useEffect(() => {
		if (isRecording) {
			console.log('recording started')
			startRecording()
		} else {
			mediaRecorderRef.current?.stop()
		}
		console.log(isRecording);

		return () => {}
	}, [isRecording])

	return (
		<div className="container">
			<canvas className="media-preview" id="canvas-preview" ref={canvasRef}></canvas>
			<video className="media-preview" id="camera-preview" ref={videoRef} autoPlay playsInline></video>
		</div>
	)
}

export default VideoCapture

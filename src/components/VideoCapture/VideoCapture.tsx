import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Camera } from '@capacitor/camera'
import './VideoCapture.css'
import { DrawingUtils } from '@mediapipe/tasks-vision'
import { Capacitor } from '@capacitor/core'
import PosingStrategy from '../../utils/posingDetection/PosingStrategy'
import { MediaPose } from '../../utils/posingDetection/Mediapose'
import { PoseNet } from '../../utils/posingDetection/PoseNet'

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
		const streamRef = useRef<MediaStream | null>(null)
		const mediaRecorderRef = useRef<MediaRecorder | null>(null)
		const recordedChunksRef = useRef<Blob[]>([])
		const trackingOverlayRef = useRef<boolean>(false)
		const poseLandmarkerRef = useRef<PosingStrategy | null>(null)

		async function requestPermissions() {
			await Camera.requestPermissions()
		}

		const startTracking = () => {
			if (
				canvasRef.current == null ||
				videoRef.current == null ||
				poseLandmarkerRef.current == null
			) {
				return
			}
			resizeCanvasToVideo()
			const canvas = canvasRef.current
			const video = videoRef.current; 
			const poseLandmarker = poseLandmarkerRef.current;
			poseLandmarker.detectAndDraw(
				canvas,
				video
			)

			window.requestAnimationFrame(startTracking)
		}

		const resizeCanvasToVideo = () => {
			if (canvasRef.current && videoRef.current) {
				const canvas = canvasRef.current
				const video = videoRef.current
				if(canvas.width != video.getBoundingClientRect().width || canvas.height != video.getBoundingClientRect().height){
					canvas.width = video.getBoundingClientRect().width;
					canvas.height = video.getBoundingClientRect().height;
				}
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

			const stream = await navigator.mediaDevices.getUserMedia(
				constraints
			)
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
				poseLandmarkerRef.current = new MediaPose()
				startWebcam()
				if (videoRef.current) {
					resizeCanvasToVideo();
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

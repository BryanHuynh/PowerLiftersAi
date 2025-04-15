import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import Footer from '../../components/Footer/Footer'
import { useEffect, useRef, useState } from 'react'
import './CameraPage.css'
import VideoCapture, { VideoCaptureHandle } from '../../components/VideoCapture/VideoCapture'
import { fetchCameraDeviceIds } from './util'
import CameraForm from '../../components/CameraForm/CameraForm'
import { getCurrentDateToMinutes, saveMedia } from '../../utils/MediaSaving'
import { Lift } from '../../Constants/Constants'

const CameraPage: React.FC = () => {
	const [isTrackingOverlay, setIsTrackingOverlay] = useState<boolean>(false)
	const [cameraDevices, setCameraDevices] = useState<string[]>([])
	const [cameraFacing, setCameraFacing] = useState(1)
	const [cameraLoaded, setCameraLoaded] = useState(false)
	const [isRecording, setIsRecording] = useState(false)
	const [isRecordingFinished, setIsRecordingFinished] = useState<boolean>(false)
	const mediaBlobRef = useRef<Blob>(null)
	const videoCaptureRef = useRef<VideoCaptureHandle>(null)

	useEffect(() => {
		console.log('starting camera')

		const assignCameraDevices = async () => {
			fetchCameraDeviceIds().then((devices: string[]) => {
				if (devices.length == 0) {
					console.error('not devices found')
					return
				}
				setCameraDevices(devices)
				setCameraLoaded(true)
			})
		}

		assignCameraDevices()
	}, [])

	useEffect(() => {
		if (videoCaptureRef && videoCaptureRef.current) {
			if (isRecording) {
				console.log('starting recording')
				videoCaptureRef.current.startRecording()
			} else {
				console.log('stopping recording')
				videoCaptureRef.current.stopRecording()
			}
		}
	}, [isRecording])


	useEffect(() => {
		if (videoCaptureRef && videoCaptureRef.current) {
			if (isTrackingOverlay) {
				console.log('starting tracking')
				videoCaptureRef.current.startTracking();
			} else {
				console.log('stopping tracking')
				videoCaptureRef.current.stopTracking();
			}
		}
	}, [isTrackingOverlay])


	const swapCamera = () => {
		setCameraFacing(cameraFacing == 0 ? 1 : 0)
	}

	const toggleRecording = () => {
		setIsRecording(!isRecording)
	}

	const toggleTrackingOverlay = () => {
		setIsTrackingOverlay(!isTrackingOverlay);
	}

	const onRecordingFinished = (blob: Blob) => {
		setIsRecordingFinished(true)
		mediaBlobRef.current = blob
	}

	const onFormSubmitted = async (data: string) => {
		const _data = JSON.parse(data)
		const lift: Lift = _data['category']
		if (mediaBlobRef.current) {
			await saveMedia(lift, mediaBlobRef.current, `${_data['category']}_${getCurrentDateToMinutes()}.mp4`)
			mediaBlobRef.current = null
		}
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton defaultHref="/home"></IonBackButton>
					</IonButtons>
					<IonTitle>Camera!</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen className="ion-padding">
				{cameraDevices.length > 0 && cameraLoaded ? <VideoCapture deviceId={cameraDevices[cameraFacing]} onRecordingFinished={(blob) => onRecordingFinished(blob)} ref={videoCaptureRef} /> : <></>}
				<CameraForm isOpen={isRecordingFinished} onClose={() => setIsRecordingFinished(false)} onSubmit={(data) => onFormSubmitted(data)} />
				<IonButtons hidden={cameraLoaded}>
					<IonButton
						color={isTrackingOverlay ? 'danger' : 'success'}
						onClick={() => {
							toggleTrackingOverlay()
						}}
					>
						{isTrackingOverlay ? 'Disable Tracking' : 'Start Tracking'}
					</IonButton>
					<IonButton
						onClick={() => {
							swapCamera()
						}}
					>
						flip camera
					</IonButton>
					<IonButton
						color={isRecording ? 'danger' : 'success'}
						onClick={() => {
							toggleRecording()
						}}
					>
						{isRecording ? 'stop recording' : 'start recording'}
					</IonButton>
				</IonButtons>
			</IonContent>
			<Footer current="camera" />
		</IonPage>
	)
}

export default CameraPage

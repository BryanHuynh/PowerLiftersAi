import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import Footer from '../../components/Footer/Footer'
import { useEffect, useRef, useState } from 'react'
import './CameraPage.css'
import VideoCapture from '../../components/VideoCapture/VideoCapture'
import { fetchCameraDeviceIds } from './util'
import CameraForm from '../../components/CameraForm/CameraForm'
import { getCurrentDateToMinutes, saveMedia } from '../../utils/MediaSaving'

const CameraPage: React.FC = () => {
	const trackingRef = useRef<boolean>(false)
	const [trackingOverlay, setTrackingOverlay] = useState<boolean>(false)
	const [cameraDevices, setCameraDevices] = useState<string[]>([])
	const [cameraFacing, setCameraFacing] = useState(1)
	const [cameraLoaded, setCameraLoaded] = useState(false)
	const [isRecording, setIsRecording] = useState(false)
	const [isRecordingFinished, setIsRecordingFinished] = useState<boolean>(false)
	const mediaBlobRef = useRef<Blob>(null);

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

	const toggleTracking = () => {
		trackingRef.current = !trackingRef.current
		setTrackingOverlay(!trackingOverlay)
	}

	const swapCamera = () => {
		setCameraFacing(cameraFacing == 0 ? 1 : 0)
	}

	const toggleRecording = () => {
		setIsRecording(!isRecording)
	}

	const onRecordingFinished = (blob: Blob) => {
		setIsRecordingFinished(true);
		mediaBlobRef.current = blob;

	}

	const onFormSubmitted = async (data: string) => {
		const _data = JSON.parse(data)
		console.log(_data)
		if(mediaBlobRef.current){
			await saveMedia(_data['category'], mediaBlobRef.current, `${_data['category']}_${getCurrentDateToMinutes()}.mp4`)
			mediaBlobRef.current = null;
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
				{cameraDevices.length > 0 && cameraLoaded ? <VideoCapture deviceId={cameraDevices[cameraFacing]} trackingOverlayRef={trackingRef} isRecording={isRecording} onRecordingFinished={(blob) => onRecordingFinished(blob)} /> : <></>}
				<CameraForm isOpen={isRecordingFinished} onClose={() => setIsRecordingFinished(false)} onSubmit={(data) => onFormSubmitted(data)}/>
				<IonButtons>
					<IonButton
						color={trackingOverlay ? 'danger' : 'success'}
						onClick={() => {
							toggleTracking()
						}}
					>
						{trackingOverlay ? 'Disable Tracking' : 'Start Tracking'}
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

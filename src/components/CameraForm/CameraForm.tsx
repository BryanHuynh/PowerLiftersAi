import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { Lift } from '../../Constants/Constants';

interface CameraForm {
	isOpen: boolean
	onClose: () => void
	onSubmit: (data: string) => void;
}

const CameraForm: React.FC<CameraForm> = ({ isOpen, onClose, onSubmit}) => {
	const _onClose = () => {
		const data = { 'category' : Lift.SQUAT}
		onSubmit(JSON.stringify(data)); 
		onClose();
	}

	return (
		<IonModal isOpen={isOpen}>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Modal</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={_onClose}>Close</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni illum quidem recusandae ducimus quos reprehenderit. Veniam, molestias quos, dolorum consequuntur nisi deserunt omnis id illo sit cum qui. Eaque, dicta.</p>
			</IonContent>
		</IonModal>
	)
}

export default CameraForm

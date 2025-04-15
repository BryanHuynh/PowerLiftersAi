import {
	IonCard,
	IonCardContent,
	IonImg,
	IonItem,
	IonThumbnail
} from '@ionic/react'
import { fetch_img } from '../../utils/FetchImage'
import './GallerySection.css'
import { Lift } from '../../Constants/Constants'

interface GallerySectionProps {
	date: string
	albumIdentifier: string
	filenames: string[]
}

const GallerySection: React.FC<GallerySectionProps> = ({
	date,
	albumIdentifier,
	filenames
}) => {
	return (
		<IonCard className="card">
			<IonCardContent>
				<h2>{date}</h2>
				<div className="gallery-grid">
					<IonThumbnail>
						<img
							alt="Silhouette of mountains"
							src="https://ionicframework.com/docs/img/demos/thumbnail.svg"
						/>
					</IonThumbnail>
				</div>
			</IonCardContent>
		</IonCard>
	)
}

export default GallerySection

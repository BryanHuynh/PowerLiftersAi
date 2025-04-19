import { IonCard, IonCardContent } from '@ionic/react'

import './GallerySection.css'

import Thumbnail from './Thumbnail'
import FileContents from './FileContents'

interface GallerySectionProps {
	date: string
	fileContents: FileContents[]
}



const GallerySection: React.FC<GallerySectionProps> = ({
	date,
	fileContents
}) => {
	return (
		<IonCard className="card">
			<IonCardContent>
				<h2>{date}</h2>
				<div className="gallery-grid">
					{fileContents.map((file) => (
						<Thumbnail fileContents={file} />
					))}
				</div>
			</IonCardContent>
		</IonCard>
	)
}

export default GallerySection

import { IonCard, IonCardContent, IonThumbnail } from '@ionic/react'

import './GallerySection.css'

import { useEffect } from 'react'

interface GallerySectionProps {
	date: string
	fileContents: FileContents[]
}

export interface FileContents {
	filename: string
	albumIdentifier: string
	thumbnailPath: string
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
						<IonThumbnail>
							<img
								alt={file.albumIdentifier + '/' + file.filename}
								src={file.thumbnailPath}
							/>
						</IonThumbnail>
					))}
				</div>
			</IonCardContent>
		</IonCard>
	)
}

export default GallerySection

import { IonCard, IonCardContent, IonThumbnail } from '@ionic/react'

import './GallerySection.css'

import { useEffect } from 'react'
import {Directory, Filesystem} from '@capacitor/filesystem'


interface GallerySectionProps {
	date: string
	fileContents: FileContents
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

	useEffect(() => {
		console.log('galleryDateFile:', fileContents)
		// createThumbnailSrc(fileContents.thumbnailPath)

	}, [galleryDateFile])

	// const createThumbnailSrc = async (file: FileContents) => {
	// 	try{
	// 		const res = await Filesystem.readFile({
	// 			path: file.albumIdentifier + '/' + file.thumbnailPath,
	// 		})
	// 	} catch (err) {
	// 		console.log(err);
	// 	}

	// }
  
	return (
		<IonCard className="card">
			<IonCardContent>
				<h2>{date}</h2>
				<div className="gallery-grid">
					<IonThumbnail>
						<img
							alt="Silhouette of mountains"
							src=''
						/>
					</IonThumbnail>
				</div>
			</IonCardContent>
		</IonCard>
	)
}

export default GallerySection

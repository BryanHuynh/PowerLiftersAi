import { IonCard, IonCardContent, IonThumbnail } from '@ionic/react'

import './GallerySection.css'

import { useEffect } from 'react'
import {Directory, Filesystem} from '@capacitor/filesystem'


interface GallerySectionProps {
	date: string
	galleryDateFile: GalleryDateFile
}

export interface GalleryDateFile {
	file: FileContents[]
}

interface FileContents {
	filename: string
	albumIdentifier: string
	thumbnailPath: string
}

const GallerySection: React.FC<GallerySectionProps> = ({
	date,
	galleryDateFile
}) => {

	useEffect(() => {
		console.log('galleryDateFile:', galleryDateFile)
		createThumbnailSrc(galleryDateFile.file[0])

	}, [galleryDateFile])

	const createThumbnailSrc = async (file: FileContents) => {
		try{
			const res = await Filesystem.readFile({
				path: file.albumIdentifier + '/' + file.thumbnailPath,
			})
		} catch (err) {
			console.log(err);
		}

	}
  
	return (
		<IonCard className="card">
			<IonCardContent>
				<h2>{date}</h2>
				<div className="gallery-grid">
					<IonThumbnail>
						<img
							alt="Silhouette of mountains"
							src="/storage/emulated/0/Android/media/io.ionic.starter/Deadlift/Deadlift_2025-4-15-8-59.png"
						/>
					</IonThumbnail>
				</div>
			</IonCardContent>
		</IonCard>
	)
}

export default GallerySection

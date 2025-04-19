import { IonIcon, IonSpinner, IonThumbnail } from '@ionic/react'
import { useEffect, useState } from 'react'
import FileContents from './FileContents'
import { getThumbnail } from '../../utils/MediaSaving'
import { alertCircleOutline } from 'ionicons/icons'

interface IProps {
	fileContents: FileContents
}

const Thumbnail: React.FC<IProps> = ({ fileContents }) => {
	const [thumbnailImage, setThumbnailImage] = useState<string>()
	const [isError, setIsError] = useState<boolean>(false)
	useEffect(() => {
		getThumbnail(fileContents.albumIdentifier + '/' + fileContents.filename)
			.then((image) => {
				setThumbnailImage(image)
			})
			.catch((err) => {
				console.error(err)
				setIsError(true)
			})
	}, [fileContents])

	const renderContent = () => {
		if (!thumbnailImage) {
			return <IonSpinner name="crescent" />
		}
		if (isError) {
			return <IonIcon icon={alertCircleOutline} color="danger" size='large' />
		}
		if (thumbnailImage) {
			return <img alt={fileContents.filename} src={thumbnailImage} />
		}
		return null
	}

	return <IonThumbnail>{renderContent()}</IonThumbnail>
}

export default Thumbnail

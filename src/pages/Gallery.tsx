import {
	IonBackButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar
} from '@ionic/react'
import { useParams } from 'react-router-dom'
import Footer from '../components/Footer/Footer'
import GallerySection from '../components/Gallery/GallerySection'
import { useEffect, useState } from 'react'
import { Lift, stringToLiftCategory } from '../Constants/Constants'
import { getYearMonthDayFromFileNames } from '../utils/FetchImage'
import { Media } from '@capacitor-community/media'
import { Filesystem } from '@capacitor/filesystem'

const Gallery: React.FC = () => {
	const params = useParams<{ category: string }>()
	const category = stringToLiftCategory(params.category)
	const [isError, setIsError] = useState<boolean>()
	const [errorMessage, setErrorMessage] = useState<string>()
	const [albumIdentifier, setAlbumIdentifier] = useState<string>()
	const [fileDates, setFileDates] = useState<Map<string, string[]>>()

	useEffect(() => {
		console.log(category)
		fetchAlbumIdentifer(category)
	}, [category])

	useEffect(() => {
		if (albumIdentifier && !isError) {
			readAlbum()
		}
	}, [albumIdentifier, isError])

	useEffect(() => {
		console.log(fileDates)
	}, [fileDates])

	const fetchAlbumIdentifer = async (lift: Lift) => {
		const { albums } = await Media.getAlbums()
		const albumIdentifier = albums.find(
			(album) => album.name === lift
		)?.identifier

		if (albumIdentifier) {
			setAlbumIdentifier(albumIdentifier)
		} else {
			setIsError(true)
			setErrorMessage('unable to find album for: ' + lift.toString())
		}
	}

	const readAlbum = async () => {
		if (albumIdentifier) {
			const contents = await Filesystem.readdir({ path: albumIdentifier })
			console.log(contents.files.length)
			if (contents.files.length === 0) {
				setIsError(true)
				setErrorMessage('No files in album: ' + albumIdentifier + '.')
				return
			}
			const filenames = contents.files.map((file) => file.name)
			const dateFileMapping = getYearMonthDayFromFileNames(filenames)
			setFileDates(dateFileMapping)
		} else {
			setIsError(true)
			setErrorMessage('unable to find album for: ' + albumIdentifier)
		}
	}

	const generateGallery = () => {
		if (fileDates && fileDates.size > 0 && albumIdentifier) {
			return Array.from(fileDates.entries()).map(([date, filenames]) => {
				return (
					<GallerySection
						date={date}
						albumIdentifier={albumIdentifier}
						filenames={filenames}
					/>
				)
			})
		}
		return null
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton defaultHref="/home"></IonBackButton>
					</IonButtons>
					<IonTitle>{category} Gallery</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen className="ion-padding">
				{isError ? (
					<>
						<h1>{errorMessage}</h1>
					</>
				) : null}

				{generateGallery()}
			</IonContent>

			<Footer current="none" />
		</IonPage>
	)
}

export default Gallery

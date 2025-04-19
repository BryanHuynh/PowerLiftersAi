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
import { useEffect, useState } from 'react'
import { Lift, stringToLiftCategory } from '../Constants/Constants'
import { getYearMonthDayFromFileNames } from '../utils/FetchImage'
import { Directory, Filesystem as FS } from '@capacitor/filesystem'
import { JSX } from 'react/jsx-runtime'
import FileContents from '../components/Gallery/FileContents'
import GallerySection from '../components/Gallery/GallerySection'

const Gallery: React.FC = () => {
	const params = useParams<{ category: string }>()
	const category = stringToLiftCategory(params.category)
	const [isError, setIsError] = useState<boolean>()
	const [errorMessage, setErrorMessage] = useState<string>()
	const [albumIdentifier, setAlbumIdentifier] = useState<string>()
	const [fileDates, setFileDates] = useState<Map<string, string[]>>()

	useEffect(() => {
		fetchAlbumIdentifer(category).catch((error) => {
			setIsError(true)
			setErrorMessage(error.message)
		})
	}, [category])

	useEffect(() => {
		if (albumIdentifier && !isError) {
			readAlbum()
		}
	}, [albumIdentifier, isError])

	useEffect(() => {}, [fileDates])

	const fetchAlbumIdentifer = async (lift: Lift) => {
		const albums = await FS.readdir({
			path: 'PowerLiftAi',
			directory: Directory.Documents
		}).catch((err) => {
			throw new Error(
				'unable to read albums directory: ERROR: ' + err.message + '.'
			)
		})

		if (!albums || albums.files.length === 0) {
			throw new Error('no albums found')
		}

		const album = albums.files.find((album) => album.name === lift)
		if (!album) {
			throw new Error(`unable to find album: ${lift}. Record a video for ${lift} to generate an album`)
		}

		setAlbumIdentifier(album?.uri.split('/').slice(-2).join('/'))
	}

	const readAlbum = async () => {
		if (!albumIdentifier) return
		const contents = await FS.readdir({
			path: albumIdentifier,
			directory: Directory.Documents
		})
		if (contents.files.length === 0) {
			setIsError(true)
			setErrorMessage('No files in album: ' + albumIdentifier + '.')
			throw new Error('No files in album: ' + albumIdentifier + '.')
		}

		const filenames = contents.files.map((file) => file.name)

		const dateFileMapping = getYearMonthDayFromFileNames(filenames)
		// console.log(dateFileMapping)
		setFileDates(dateFileMapping)
	}

	const generateGallery = () => {
		if (isError) return <h1>{errorMessage}</h1>
		const elements: JSX.Element[] = []
		if (fileDates && fileDates.size > 0 && albumIdentifier) {
			fileDates.forEach((files, date) => {
				const fileContents: FileContents[] = []
				files.forEach(async (file) => {
					fileContents.push({
						filename: file,
						albumIdentifier: albumIdentifier
					})
				})
				const element = (
					<GallerySection date={date} fileContents={fileContents} />
				)
				elements.push(element)
			})
			return elements
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
				{generateGallery()}
			</IonContent>

			<Footer current="none" />
		</IonPage>
	)
}

export default Gallery

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
import GallerySection, {
	FileContents,
	GalleryDateFile
} from '../components/Gallery/GallerySection'
import { useEffect, useState } from 'react'
import { Lift, stringToLiftCategory } from '../Constants/Constants'
import { getYearMonthDayFromFileNames } from '../utils/FetchImage'
import { Directory, Filesystem as FS } from '@capacitor/filesystem'

const Gallery: React.FC = () => {
	const params = useParams<{ category: string }>()
	const category = stringToLiftCategory(params.category)
	const [isError, setIsError] = useState<boolean>()
	const [errorMessage, setErrorMessage] = useState<string>()
	const [albumIdentifier, setAlbumIdentifier] = useState<string>()
	const [fileDates, setFileDates] = useState<Map<string, string[]>>()

	useEffect(() => {
		fetchAlbumIdentifer(category)
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
		})
		let album
		try {
			if (!albums || albums.files.length === 0) {
				throw new Error('no albums found')
			}

			album = albums.files.find((album) => album.name === lift)
			if (!album) {
				throw new Error(`unable to find album: ${lift}`)
			}
		} catch {
			setIsError(true)
			setErrorMessage(`unable to find album: ${lift}`)
			return
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
		console.log(dateFileMapping)
		setFileDates(dateFileMapping)
	}

	const seperateMediaAndThumbnails = (files: string[]) => {
		const fileMapping = new Map<string, {filename?: string, thumbnail?: string}>()
		files.forEach((file) => {
			const [filename, extension] = file.split('.')
			console.log(filename, extension);
		})
		return fileMapping
	}

	const generateGallery = () => {
		if (fileDates && fileDates.size > 0 && albumIdentifier) {
			fileDates.forEach((files, date) => {
				seperateMediaAndThumbnails(files);
			});

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
			</IonContent>
			{generateGallery()}

			<Footer current="none" />
		</IonPage>
	)
}

export default Gallery

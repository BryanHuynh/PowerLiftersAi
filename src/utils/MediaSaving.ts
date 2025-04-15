import { Lift} from '../Constants/Constants'
import { MediaSaveOptions, Media } from '@capacitor-community/media'

export const saveMedia = async (lift: Lift, blob: Blob, filename: string) => {
	const albumPath = await createAlbum(lift)
	const videoURL = (await convertBlobToBase64(blob)) as string
	const opts: MediaSaveOptions = { path: videoURL, albumIdentifier: albumPath, fileName: filename }
	await Media.saveVideo(opts)
}

const createAlbum = async (lift: Lift): Promise<string> => {
	const { albums } = await Media.getAlbums()
	const liftAlbum = albums.find((album) => album.name === lift)
	if (liftAlbum) {
		console.log(`Album: ${lift} already exists`)
		return liftAlbum.identifier
	}
	await Media.createAlbum({ name: lift })
	return (await Media.getAlbums()).albums.find((album) => album.name === lift)!.identifier
}

function convertBlobToBase64(blob: Blob): Promise<string | ArrayBuffer> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onerror = reject
		reader.onload = () => {
			resolve(reader.result!.toString())
		}
		reader.readAsDataURL(blob) // Use readAsDataURL to get base64
	})
}

export const getCurrentDateToMinutes = () => {
	const now = new Date() // Get the current date and time
	const year = now.getFullYear()
	const month = now.getMonth() + 1 // Month is 0-indexed, so add 1
	const day = now.getDate()
	const hours = now.getHours()
	const minutes = now.getMinutes()
	return `${year}-${month}-${day}-${hours}-${minutes}`
}

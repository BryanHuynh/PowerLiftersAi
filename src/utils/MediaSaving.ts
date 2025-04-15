import { Lift, LiftDirectoryPathType, VIDEO_DIRECTORY_PATH, liftDirectoryPaths } from '../Constants/Constants'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import { MediaSaveOptions, Media } from '@capacitor-community/media'

export const saveMedia = async (category: LiftDirectoryPathType, blob: Blob, filename: string) => {
	const albumPath = await createAlbum(Lift.SQUAT)
  const videoURL = await convertBlobToBase64(blob) as string;
	const opts: MediaSaveOptions = { path: videoURL, albumIdentifier: albumPath }
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
      resolve(reader.result!.toString());
    };
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

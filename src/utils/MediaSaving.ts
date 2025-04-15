import { Lift} from '../Constants/Constants'
import { MediaSaveOptions, Media } from '@capacitor-community/media'

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

const getThumbnail = async (blob: Blob): Promise<string> => {
	return new Promise((resolve, reject) => {
		const video = document.createElement('video');
		const canvas = document.createElement('canvas');
	
		video.src = URL.createObjectURL(blob);
		video.crossOrigin = 'anonymous';
		video.muted = true;
		video.playsInline = true;
	
		video.addEventListener('loadeddata', () => {
		  video.currentTime = 1;
		});
	
		video.addEventListener('seeked', () => {
		  canvas.width = video.videoWidth;
		  canvas.height = video.videoHeight;
	
		  const ctx = canvas.getContext('2d');
		  if (ctx) {
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			const dataUrl = canvas.toDataURL('image/png'); // or 'image/jpeg'
			resolve(dataUrl);
		  } else {
			reject(new Error('Could not get canvas context'));
		  }
		  URL.revokeObjectURL(video.src); // cleanup
		});
	
		video.addEventListener('error', (e) => {
		  reject(new Error('Error loading video'));
		});
	  });
}

export const saveMedia = async (lift: Lift, blob: Blob, filename: string) => {
	const albumPath = await createAlbum(lift)
	const videoURL = (await convertBlobToBase64(blob)) as string
	const opts: MediaSaveOptions = { path: videoURL, albumIdentifier: albumPath, fileName: filename }
	await Media.saveVideo(opts)

	const thumbnail = await getThumbnail(blob);
	const thumbnailOpts: MediaSaveOptions = {path: thumbnail, albumIdentifier: albumPath, fileName: filename}
	await Media.savePhoto(thumbnailOpts)
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
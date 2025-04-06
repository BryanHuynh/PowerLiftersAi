import { LiftDirectoryPathType, VIDEO_DIRECTORY_PATH, liftDirectoryPaths } from '../Constants/Constants'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'

export const saveMedia = async (category: LiftDirectoryPathType, blob: Blob, filename: string) => {
	try {
		const directoryPath = liftDirectoryPaths[category]
        const fullPath = `${directoryPath}${filename}`;
        console.log(blob.type);
        const base64Data = await convertBlobToBase64(blob) as string;
		await Filesystem.writeFile({
			path: fullPath,
            data: base64Data,
			directory: Directory.Documents
		})

		console.log(`Media saved to: ${fullPath}`)
		return fullPath
	} catch (error) {
		console.error('Error saving media:', error)
		throw error
	}
}

function convertBlobToBase64(blob: Blob): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result!.toString().split(',')[1]); // remove 'data:*/*;base64,'
      };
      reader.readAsDataURL(blob); // Use readAsDataURL to get base64
    });
  }

  export const getCurrentDateToMinutes = () => {
    const now = new Date(); // Get the current date and time
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Month is 0-indexed, so add 1
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${year}-${month}-${day}-${hours}-${minutes}`;
  }

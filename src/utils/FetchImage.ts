import Squat from '../assets/Squat.png'
import Bench from '../assets/Bench.png'
import DeadLift from '../assets/Deadlift.png'
import { Lift, liftDirectoryPaths, LiftDirectoryPathType } from '../Constants/Constants'
import { Directory, File, Filesystem } from '@capacitor/filesystem'

export const fetch_img = (date: string, category: Lift): string[] => {
	let _retImage
	switch (category) {
		case Lift.SQUAT:
			_retImage = Squat
			break
		case Lift.BENCH_PRESS:
			_retImage = Bench
			break
		default:
			getVideoFilenames('Deadlift')
			_retImage = DeadLift
	}

	const _list: string[] = []
	for (let i = 0; i < 5; i++) {
		_list.push(_retImage)
	}
	return _list
}

export const getVideoFilenames = async (lift: LiftDirectoryPathType): Promise<string[]> => {
	const ret: string[] = []
	console.log('path', liftDirectoryPaths[lift])
	await Filesystem.readdir({
		path: liftDirectoryPaths[lift],
		directory: Directory.Documents
	})
		.then((filenames) => {
      filenames.files.forEach((filename) => {
        ret.push(filename.name);
      })
		})
		.catch((e) => {
			console.log('error', e)
		})
	return ret
}

export const getYearMonthDayFromFileNames = (filenames: string[]): Map<string, string[]> => {
	const ret: Map<string, string[]> = new Map()
	const regex = /(\d{4})-(\d)-(\d)/
	const re = new RegExp(regex)
	filenames.forEach((filename) => {
		const match = filename.match(re)
		if (match && match.length > 0) {
			const date = match[0]
      if (ret.has(date)) {
				ret.get(date)?.push(filename)
			} else {
				ret.set(date, [filename])
			}
		}
	})
	return ret
}

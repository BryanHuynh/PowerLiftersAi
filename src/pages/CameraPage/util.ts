export const fetchCameraDeviceIds = async (): Promise<string[]> => {
	if(!navigator.mediaDevices) {
		throw new Error('unable to get media devices');
	}
	const tempStream = await navigator.mediaDevices.getUserMedia({
		video: true
	})
	const devices = (await navigator.mediaDevices.enumerateDevices()).filter(
		(device) => device.label
	)
	devices.forEach((device) => {
		console.log(device.label, device.deviceId)
	})
	let frontDeviceId
	let backDeviceId
	if (devices.length > 0) {
		console.log(devices)
		frontDeviceId = devices[0].deviceId
		backDeviceId = devices[0].deviceId
	}
	devices.forEach((device) => {
		if (device.kind === 'videoinput') {
			if (device.label && device.label.length > 0) {
				if (device.label.toLowerCase().indexOf('back') >= 0)
					backDeviceId = device.deviceId
				else if (device.label.toLowerCase().indexOf('front') >= 0)
					frontDeviceId = device.deviceId
			}
		}
	})
	// stop tracks
	tempStream.getTracks().forEach((track) => track.stop())
	const ret: string[] = []
	if (frontDeviceId) ret.push(frontDeviceId)
	if (backDeviceId) ret.push(backDeviceId)
	console.log('utils: camera device ids', frontDeviceId, backDeviceId)
	return ret
}

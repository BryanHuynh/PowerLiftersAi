export const fetchCameraDeviceIds = async (): Promise<string[]> => {
  const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
  const devices = (await navigator.mediaDevices.enumerateDevices()).filter( device => device.label);
  devices.forEach (device => {
    console.log(device.label, device.deviceId);
  })
  let frontDeviceId;
  let backDeviceId;
  if (devices.length > 0) {
    console.log(devices);
    frontDeviceId = devices[0].deviceId;
    backDeviceId = devices[0].deviceId;
  }
  devices.forEach (device => {
    if( device.kind === 'videoinput' ) {
      if( device.label && device.label.length > 0 ) {
        if( device.label.toLowerCase().indexOf( 'back' ) >= 0 ) 
          backDeviceId = device.deviceId
        else if( device.label.toLowerCase().indexOf( 'front' ) >= 0 )
          frontDeviceId = device.deviceId
      }
    }
  })
  // stop tracks
  tempStream.getTracks().forEach(track => track.stop());
  const ret: string[] = [];
  if(frontDeviceId) ret.push(frontDeviceId);
  if(backDeviceId) ret.push(backDeviceId);
  console.log('utils: camera device ids', frontDeviceId, backDeviceId)
  return ret;
};
// 19:17:29.404  I  File: https://localhost/assets/index-CBj2u3vQ.js - Line 142 - Msg: camera2 1, facing front 1870f493a0ab1834f9776e2f1b60626d6084c5abd86a10d7d7d1562c622d9eaf
// 19:17:29.404  I  File: https://localhost/assets/index-CBj2u3vQ.js - Line 142 - Msg: camera2 3, facing front 914f8a51f5b840827a3d5d37345819f39431878af5ca7281eedc0b0562b6f1da
// 19:17:29.405  I  File: https://localhost/assets/index-CBj2u3vQ.js - Line 142 - Msg: camera2 2, facing back b2f4879ca900f756e532230a85d98217f9b854fb3a9b1f916bd1e49bd5f59f33
// 19:17:29.405  I  File: https://localhost/assets/index-CBj2u3vQ.js - Line 142 - Msg: camera2 0, facing back cd7e6d6bad567206e8ff16bc961fa03805f9a2f6ccbbc90bca6a0ce9be2525f7

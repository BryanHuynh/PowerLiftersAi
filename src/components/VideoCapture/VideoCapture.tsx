import { useRef } from "react";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const VideoCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
	let stream: MediaStream;
	let recorder: MediaRecorder;
	


  const recordVideo = async () => {
		console.log(navigator.mediaDevices);
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: true,
        });
				if(videoRef.current){
					videoRef.current.srcObject = stream;
				}
      } catch (error) {
        console.log("Video Ref or Navigator.mediaDevices is null ", error);
      }

			const options = { mimeType: 'video/webm'};
			recorder = new MediaRecorder(stream, options);
			recorder.start();
    
  };

	const startMediaDevice = () => {

	}

	startMediaDevice();
	recordVideo();

	
  return (
    <>
      <video
        className="video"
        autoPlay
        muted
        ref={videoRef}
        playsInline
      ></video>
      <div id="fullscreen" slot="fixed"></div>
    </>
  );
};

export default VideoCapture;

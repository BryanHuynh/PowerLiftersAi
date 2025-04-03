import { useEffect, useRef, useState } from "react";
import { Camera } from "@capacitor/camera";
import "./VideoCapture.css";
import {
  DrawingUtils,
  PoseLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import { Capacitor } from "@capacitor/core";

interface VideoCameraProps {
  deviceId: string;
}

const VideoCapture: React.FC<VideoCameraProps> = ({ deviceId }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const poseLandmarkerRef: useRef<typeof PoseLandmarker> = useRef(null);

  const wasmUrl: string =
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm";
  const modelAssetPath: string =
    "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task";

  const startPoselandmarker = async () => {
    return await PoseLandmarker.createFromOptions(
      await FilesetResolver.forVisionTasks(wasmUrl),
      {
        baseOptions: { modelAssetPath: modelAssetPath, delegate: "GPU" },
        outputSegmentationMasks: true, // We will draw the face mesh in canvas.
        runningMode: "VIDEO",
      }
    );
  };

  async function requestPermissions() {
    const status = await Camera.requestPermissions();
    console.log("VIDEO CAPTURE:", status.camera, navigator.mediaDevices);
  }

  const startTracking = async () => {
    let lastVideoTime = -1;
    let results: any = undefined;

    if (
      canvasRef.current &&
      videoRef.current &&
      canvasCtxRef.current &&
      poseLandmarkerRef.current
    ) {
      const drawingUtils = new DrawingUtils(canvasCtxRef.current);
      canvasRef.current.width = videoRef.current.getBoundingClientRect().width;
      canvasRef.current.height =
        videoRef.current.getBoundingClientRect().height;
      const startTimeMs = performance.now();
      if (lastVideoTime != videoRef.current.currentTime) {
        lastVideoTime = videoRef.current.currentTime;
        poseLandmarkerRef.current.detectForVideo(
          videoRef.current,
          startTimeMs,
          (result) => {
            if (
              canvasRef.current &&
              videoRef.current &&
              canvasCtxRef.current &&
              poseLandmarkerRef.current
            ) {
              canvasCtxRef.current.save();
              canvasCtxRef.current.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              );
              for (const landmark of result.landmarks) {
                drawingUtils.drawLandmarks(landmark, {
                  radius: (data) =>
                    DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
                });
                drawingUtils.drawConnectors(
                  landmark,
                  PoseLandmarker.POSE_CONNECTIONS
                );
              }
              canvasCtxRef.current.restore();
            }
          }
        );
      }
      window.requestAnimationFrame(startTracking);
    }
  };
  const startWebcam = async () => {
    if (Capacitor.getPlatform() == "android") {
      await requestPermissions();
    }

    const constraints: MediaStreamConstraints = {
      video: {
        deviceId: { exact: deviceId },
      },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log("VideoCapture.tsx: loaded device: ", stream.id);
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    streamRef.current = stream;
  };

  const stopWebcam = () => {
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => {
        track.stop();
        streamRef.current?.removeTrack(track);
      });

      streamRef.current = null;
    }
  };

  useEffect(() => {
    stopWebcam();
    console.log("VideoCamera.tsx: camera device id: ", deviceId);
    const intialize = async () => {
      if (canvasRef.current) {
        canvasCtxRef.current = canvasRef.current.getContext("2d");
      }
      const poseLandmakrer = await startPoselandmarker();
      poseLandmarkerRef.current = poseLandmakrer;
      startWebcam();
      if (
        videoRef.current &&
        canvasRef.current &&
        canvasCtxRef.current &&
        poseLandmarkerRef.current
      ) {
        videoRef.current.addEventListener("loadeddata", startTracking);
      }
    };
    intialize();
    return () => {
      console.log("VideoCapture.tsx: unloaded component");
      stopWebcam();
    };
  }, [deviceId]);


  return (
    <div className="container">
      <canvas
        className="media-preview"
        id="canvas-preview"
        ref={canvasRef}
      ></canvas>
      <video
        className="media-preview"
        id="camera-preview"
        ref={videoRef}
        autoPlay
        playsInline
      ></video>
    </div>
  );
};

export default VideoCapture;

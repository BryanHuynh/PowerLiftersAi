import { useEffect, useRef, useState } from "react";
import "./VideoCapture.css";
import {
  DrawingUtils,
  PoseLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

const VideoCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const poseLandmarkerRef: useRef<typeof PoseLandmarker> = useRef(null);

  const wasmUrl: string =
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm";
  const modelAssetPath: string =
    "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task";

  const startFacelandmarker = async () => {
    return await PoseLandmarker.createFromOptions(
      await FilesetResolver.forVisionTasks(wasmUrl),
      {
        baseOptions: { modelAssetPath: modelAssetPath, delegate: "GPU" },
        outputSegmentationMasks: true, // We will draw the face mesh in canvas.
        runningMode: "VIDEO",
      }
    );
  };

  const startTracking = async () => {
    let lastVideoTime = -1;
    let results: any = undefined;

    if (
      canvasRef.current &&
      videoRef.current &&
      canvasCtxRef.current &&
      poseLandmarkerRef.current
    ) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const canvasCtx = canvasCtxRef.current;
      const poseLandmarker = poseLandmarkerRef.current;

      const drawingUtils = new DrawingUtils(canvasCtx);
      canvasRef.current.width = videoRef.current.getBoundingClientRect().width;
      canvasRef.current.height =
        videoRef.current.getBoundingClientRect().height;
      const startTimeMs = performance.now();
      if (lastVideoTime != video.currentTime) {
        lastVideoTime = video.currentTime;
        poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
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
          canvasCtx.restore();
        });
      }

      // if (results.poseLandmarks) {
      //   for (const landmarks of results.poseLandmarks) {
      //     drawingUtils.drawConnectors(
      //       landmarks,
      //       PoseLandmarker.POSE_CONNECTIONS,
      //       {
      //         color: "#00FF00",
      //         lineWidth: 4,
      //       }
      //     );

      //     drawingUtils.drawLandmarks(landmarks, {
      //       color: "#FF0000",
      //       lineWidth:
      //       2,
      //     });
      //   }
      // }

      // results = faceLandmarker.detectForVideo(video, Date.now());

      // if (results.faceLandmarks) for (const landmarks of results.faceLandmarks) {
      //   [FaceLandmarker.FACE_LANDMARKS_TESSELATION, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE]
      //     .every((type, i) => drawingUtils.drawConnectors(landmarks, type, { color: "#C0C0C070", lineWidth: i == 0 ? 1 : 4 }))
      // };

      window.requestAnimationFrame(() => {
        setTimeout(startTracking, 1000 / 60);
      });
    }
  };
  const startWebcam = async () => {
    if (
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      videoRef.current
    ) {
      await navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          streamRef.current = stream;
        });
    }
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
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext("2d");
    }

    startFacelandmarker().then((res) => {
      poseLandmarkerRef.current = res;
    });
    startWebcam();
    if (videoRef.current && canvasRef.current) {
      videoRef.current.addEventListener("loadeddata", startTracking);
    }

    return () => {
      stopWebcam();
    };
  });

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

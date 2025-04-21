import { DrawingUtils } from "@mediapipe/tasks-vision";

export default interface PosingStrategy {
    detectAndDraw: (canvas: HTMLCanvasElement, video: HTMLVideoElement) => void
}


import { DrawingUtils } from "@mediapipe/tasks-vision";

export default interface PosingStrategy {
    detectAndDraw: (drawingUtils: DrawingUtils, ctx: CanvasRenderingContext2D, videoRef: HTMLVideoElement) => void
}


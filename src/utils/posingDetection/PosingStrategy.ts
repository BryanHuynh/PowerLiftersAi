import { DrawingUtils } from "@mediapipe/tasks-vision";

export default interface PosingStrategy {
    initalize: () => void;
    detectAndDraw: (drawingUtils: DrawingUtils, ctx: CanvasRenderingContext2D) => void
}


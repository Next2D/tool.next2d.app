import { $getCanvas } from "@/global/GlobalUtil";

/**
 * @description VideoElementの指定再生位置でCanvasを生成
 *              Create Canvas at specified playback position of VideoElement
 *
 * @param  {HTMLVideoElement} video
 * @param  {number} sec
 * @return {HTMLCanvasElement}
 * @method
 * @public
 */
export const execute = (
    video: HTMLVideoElement,
    sec: number = 0
): HTMLCanvasElement => {

    const width  = video.videoWidth;
    const height = video.videoHeight;

    const canvas  = $getCanvas();
    canvas.width  = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
        return canvas;
    }

    console.log(video.duration);
    video.currentTime = sec;
    context.drawImage(video, 0, 0, width, height);

    return canvas;
};
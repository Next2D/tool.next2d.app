/**
 * @description プレビューエリアに表示する音声Elementを返却
 *              Return audio Element to be displayed in preview area
 *
 * @params {HTMLCanvasElement} canvas
 * @params {HTMLAudioElement} audio
 * @return {HTMLElement}
 * @method
 * @public
 */
export const execute = (canvas: HTMLCanvasElement, audio: HTMLAudioElement): HTMLElement =>
{
    // canvasを格納するdiv element
    const canvasElement = document.createElement("div");
    canvasElement.classList.add("sound-canvas-element");
    canvasElement.appendChild(canvas);

    // audioを格納するdiv element
    const audioElement = document.createElement("div");
    audioElement.classList.add("sound-audio-element");
    audioElement.appendChild(audio);

    const element = document.createElement("div");
    element.classList.add("sound-parent");
    element.appendChild(canvasElement);
    element.appendChild(audioElement);

    return element;
};
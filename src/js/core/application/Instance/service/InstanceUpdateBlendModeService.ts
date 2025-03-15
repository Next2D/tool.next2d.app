import type { IBlendMode } from "@/interface/IBlendMode";

/**
 * @description Canvasにブレンドモードのstyleをセット
 *              Set the style of the blend mode on the Canvas
 *
 * @param  {HTMLCanvasElement} canvas
 * @param  {string} blend_mode
 * @return {void}
 * @method
 * @public
 */
export const execute = (canvas: HTMLCanvasElement, blend_mode: IBlendMode): void =>
{
    switch (blend_mode) {

        case "normal":
            canvas.style.filter = "";
            canvas.style.mixBlendMode = "";
            break;

        case "add":
            canvas.style.filter = "";
            canvas.style.mixBlendMode = "color-dodge";
            break;

        case "subtract":
            canvas.style.filter = "invert(100%)";
            canvas.style.mixBlendMode = "multiply";
            break;

        case "invert":
            canvas.style.filter = "invert(100%)";
            canvas.style.mixBlendMode = "difference";
            break;

        case "hardlight":
            canvas.style.filter = "";
            canvas.style.mixBlendMode = "hard-light";
            break;

        case "alpha":
        case "erase":
        case "layer":
            canvas.style.filter = "";
            canvas.style.mixBlendMode = "";
            break;

        default:
            canvas.style.filter = "";
            canvas.style.mixBlendMode = blend_mode;
            break;

    }
};
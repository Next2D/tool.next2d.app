import type { IBlendMode } from "@/interface/IBlendMode";

/**
 * @description Elementにブレンドモードのstyleをセット
 *              Set the style of the blend mode on the Element
 *
 * @param  {HTMLElement} element
 * @param  {string} blend_mode
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement, blend_mode: IBlendMode): void =>
{
    switch (blend_mode) {

        case "normal":
            element.style.filter = "";
            element.style.mixBlendMode = "";
            break;

        case "add":
            element.style.filter = "";
            element.style.mixBlendMode = "color-dodge";
            break;

        case "subtract":
            element.style.filter = "invert(100%)";
            element.style.mixBlendMode = "multiply";
            break;

        case "invert":
            element.style.filter = "invert(100%)";
            element.style.mixBlendMode = "difference";
            break;

        case "hardlight":
            element.style.filter = "";
            element.style.mixBlendMode = "hard-light";
            break;

        case "alpha":
        case "erase":
        case "layer":
            element.style.filter = "";
            element.style.mixBlendMode = "";
            break;

        default:
            element.style.filter = "";
            element.style.mixBlendMode = blend_mode;
            break;

    }
};
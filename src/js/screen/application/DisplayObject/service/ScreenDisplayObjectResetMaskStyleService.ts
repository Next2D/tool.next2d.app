/**
 * @description マスクインのElementのスタイルを初期化
 *              Initialize the style of the mask-in element
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // styleを初期化
    const style = element.style;
    style.mask = style.webkitMask = "";
    style.maskSize = style.webkitMaskSize = "";
    style.maskRepeat = style.webkitMaskRepeat = "";
    style.maskPosition = style.webkitMaskPosition = "";
};
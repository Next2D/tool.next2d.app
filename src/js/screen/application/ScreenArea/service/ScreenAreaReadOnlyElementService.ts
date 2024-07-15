/**
 * @description DisplayObjectをスクリーンに配置だけする
 *              Just place the DisplayObject on the screen
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    if (!element.classList.contains("disabled")) {
        element.classList.add("disabled");
    }
    if (!element.classList.contains("translucent")) {
        element.classList.add("translucent");
    }
};
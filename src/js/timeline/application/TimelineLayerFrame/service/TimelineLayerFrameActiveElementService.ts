/**
 * @description 選択したフレームElementをアクティブ表示にしてマップに登録
 *              Register the selected frame Element on the map with the active display
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    element.classList.add("frame-active");
};
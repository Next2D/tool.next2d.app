/**
 * @description 指定IDのElementをアクティブ表示に変更する
 *              Changes the Element with the specified ID to the active display
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    element.contentEditable    = "true";
    element.style.borderBottom = "1px solid #f5f5f5";
    element.style.height       = "20px";
    element.focus();
};
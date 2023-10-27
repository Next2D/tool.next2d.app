/**
 * @description 指定IDのElementを非アクティブに変更する
 *              Change the Element with the specified ID to inactive
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    element.contentEditable = "false";
    element.setAttribute("style", "");
};
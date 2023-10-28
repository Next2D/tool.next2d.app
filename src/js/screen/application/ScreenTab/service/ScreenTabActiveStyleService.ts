/**
 * @description 指定IDのElementをアクティブ表示に変更する
 *              Changes the Element with the specified ID to the active display
 *
 * @params {HTMLElement} text_element
 * @params {HTMLElement} tab_element
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    text_element: HTMLElement,
    tab_element: HTMLElement
): void =>
{
    text_element.contentEditable   = "true";
    tab_element.style.borderBottom = "1px solid #f5f5f5";
};
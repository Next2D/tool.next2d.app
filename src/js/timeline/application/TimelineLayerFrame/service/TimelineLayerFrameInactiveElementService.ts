/**
 * @description 選択したフレームElementを非アクティブ表示
 *              Inactivate selected frame Element
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // styleがなければ終了
    if (!element.classList.contains("frame-active")) {
        return ;
    }

    // styleを削除
    element.classList.remove("frame-active");
};
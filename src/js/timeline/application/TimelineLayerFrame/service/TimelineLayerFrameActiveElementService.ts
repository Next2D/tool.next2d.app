/**
 * @description 選択したフレームElementをアクティブ表示
 *              Active display of selected frame Element
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // 既にstyleが登録されていれば終了
    if (element.classList.contains("frame-active")) {
        return ;
    }

    // styleをセット
    element.classList.add("frame-active");
};
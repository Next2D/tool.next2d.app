/**
 * @description 指定のレイヤーElementをアクティブ表示に更新する
 *              Update the specified Layer Element to the active view
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    if (element.classList.contains("active")) {
        return ;
    }

    // フレームをアクティブに更新
    element.classList.add("active");
};
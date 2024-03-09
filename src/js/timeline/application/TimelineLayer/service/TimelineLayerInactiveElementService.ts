/**
 * @description 指定のレイヤーElementを非アクティブ表示に更新する
 *              Update specified Layer Element to inactive view
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    if (!element.classList.contains("active")) {
        return ;
    }

    // フレームをアクティブに更新
    element.classList.remove("active");
};
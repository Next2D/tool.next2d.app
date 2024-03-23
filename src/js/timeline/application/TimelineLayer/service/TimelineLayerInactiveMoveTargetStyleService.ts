/**
 * @description 指定のレイヤーElementのclassを非アクティブ表示に更新する
 *              Update the class of the specified layer element to inactive view
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    if (!element.classList.contains("move-target")) {
        return ;
    }

    // 選択中のborder表示を削除
    element.classList.remove("move-target");
};
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
    // 非表示クラスを削除
    element.classList.remove("disable");

    // アクティブクラスをセット
    element.classList.add("active");
};
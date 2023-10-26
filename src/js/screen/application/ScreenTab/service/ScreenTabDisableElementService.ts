/**
 * @description 指定IDのElementを非アクティの表示に変更する
 *              Change the Element with the specified ID to show inactive
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // 非表示クラスを削除
    element.classList.remove("active");

    // アクティブクラスをセット
    element.classList.add("disable");
};
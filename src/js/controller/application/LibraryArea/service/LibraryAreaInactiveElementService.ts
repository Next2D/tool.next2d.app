/**
 * @description 指定のライブラリIDのElementを非アクティブ表示に更新
 *              Update Element of specified library ID to inactive display
 *
 * @param  {number} library_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (library_id: number): void =>
{
    const element: HTMLElement | null = document
        .getElementById(`library-child-id-${library_id}`);

    if (!element || !element.classList.contains("active")) {
        return ;
    }

    // アクティブ解除
    element.classList.remove("active");
};
/**
 * @description 指定のライブラリIDのElementをアクティブ表示に更新
 *              Update Element of specified library ID to active display
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

    if (!element) {
        return ;
    }

    element.classList.add("active");
};
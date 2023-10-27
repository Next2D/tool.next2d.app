/**
 * @description 指定IDのプロジェクト名を表示しているElementを返却
 *              Returns Element displaying the project name of the specified ID
 *
 * @params {number} id
 * @return {HTMLElement | null}
 * @method
 * @public
 */
export const execute = (id: number): HTMLElement | null =>
{
    return document.getElementById(`tab-text-id-${id}`);
};
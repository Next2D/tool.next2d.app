/**
 * @description 指定IDのタブElementを返却
 *              Returns the tab Element of the specified ID.
 *
 * @params {number} id
 * @return {HTMLElement | null}
 * @method
 * @public
 */
export const execute = (id: number): HTMLElement | null =>
{
    return document.getElementById(`tab-menu-id-${id}`);
};
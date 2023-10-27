/**
 * @description 指定IDのInput Elementを返却
 *              Returns Input Element with specified ID
 *
 * @params {number} id
 * @return {HTMLElement | null}
 * @method
 * @public
 */
export const execute = (id: number): HTMLElement | null =>
{
    return document.getElementById(`tab-input-id-${id}`);
};
/**
 * @description 対象のスクリプトElementをstringで返却
 *              Target script Element returned as string
 *
 * @params {number} id
 * @params {number} name
 * @return {string}
 * @method
 * @public
 */
export const execute = (id: number, frame: number): string =>
{
    return `<div data-library-id="${id}" data-frame="${frame}" class="internal-child"><i></i>frame ${frame}</div>`;
};
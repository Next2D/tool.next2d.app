/**
 * @description タブ一覧のElementをstringで返却
 *              Return Element of tab list as string
 *
 * @params {number} id
 * @params {string} name
 * @return {string}
 * @method
 * @public
 */
export const execute = (id: number , name: string): string =>
{
    return `<div id="tab-menu-id-${id}" data-tab-id="${id}">${name}</div>`;
};
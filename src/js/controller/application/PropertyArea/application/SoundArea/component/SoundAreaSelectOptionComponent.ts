/**
 * @description サウンドエリアのセレクトオプションのElementをstringで返却
 *              Returns the Element of the select option in the sound area as a string
 *
 * @param  {number} id
 * @param  {string} path
 * @return {string}
 * @method
 * @public
 */
export const execute = (id: number, path: string): string =>
{
    return `<option value="${id}">${path}</option>`;
};
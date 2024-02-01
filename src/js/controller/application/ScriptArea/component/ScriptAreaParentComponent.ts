/**
 * @description 対象のMovieClipのElementをstringで返却
 *              Return the Element of the target MovieClip as a string
 *
 * @params {number} id
 * @params {string} name
 * @return {string}
 * @method
 * @public
 */
export const execute = (id: number, name: string): string =>
{
    return `<div data-library-id="${id}" class="internal-parent"><i></i>${name}</div>`;
};
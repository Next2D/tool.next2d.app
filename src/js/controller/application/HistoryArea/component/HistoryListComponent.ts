/**
 * @description 作業履歴のElementをstringで返却
 *              Return Element of work history as string
 *
 * @params {number} frame
 * @params {string} text
 * @return {string}
 * @method
 * @public
 */
export const execute = (index: number, text: string): string =>
{
    return `
<div data-index="${index}">
    <span class="language" data-text="{{${text}}}">${text}</span> 
</div>
`;
};
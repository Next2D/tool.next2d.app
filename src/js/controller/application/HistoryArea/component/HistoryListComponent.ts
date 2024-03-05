import { $LANGUAGE_SPLIT_TEXT } from "@/config/LanguageConfig";

/**
 * @description 作業履歴のElementをstringで返却
 *              Return Element of work history as string
 *
 * @params {number} movie_clip_id
 * @params {number} index
 * @params {string} text
 * @return {string}
 * @method
 * @public
 */
export const execute = (
    movie_clip_id: number,
    index: number,
    text: string,
    ...values: Array<string | number>
): string => {
    return `
<div data-index="${index}" data-library-id="${movie_clip_id}">
    <span class="language" data-text="{{${text}}}" data-args="${values.join($LANGUAGE_SPLIT_TEXT)}">${text}</span> 
</div>
`;
};
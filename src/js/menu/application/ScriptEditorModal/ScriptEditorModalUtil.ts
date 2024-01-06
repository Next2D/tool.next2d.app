import type { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @type {AceAjax.Editor}
 * @private
 */
const $editor: AceAjax.Editor = ace.edit("editor");

/**
 * @description AceEditorオブジェクトを返却
 *              Return AceEditor object
 *
 * @return {AceAjax.Editor}
 * @method
 * @public
 */
export const $getAceEditor = (): AceAjax.Editor =>
{
    return $editor;
};

/**
 * @type {MovieClip}
 * @default null
 * @private
 */
let $movieClip: MovieClip | null = null;

/**
 * @description 編集対象のMovieClipを返却
 *              Return the MovieClip to be edited
 *
 * @return {MovieClip | null}
 * @method
 * @public
 */
export const $getTargetMovieClip = (): MovieClip | null =>
{
    return $movieClip;
};

/**
 * @description 編集対象のMovieClipをセット
 *              Set the MovieClip to be edited
 *
 * @param {MovieClip} movie_clip
 * @method
 * @public
 */
export const $setTargetMovieClip = (movie_clip: MovieClip) =>
{
    $movieClip = movie_clip;
};

/**
 * @type {number}
 * @default 1
 * @private
 */
let $frame: number = 1;

/**
 * @description 編集対象のフレーム番号を返却
 *              Returns the frame number to be edited
 *
 * @return {number}
 * @method
 * @public
 */
export const $getTargetFrame = (): number =>
{
    return $frame;
};

/**
 * @description 編集対象のフレーム番号をセット
 *              Set frame number to be edited
 *
 * @param {number} frame
 * @method
 * @public
 */
export const $setTargetFrame = (frame: number) =>
{
    $frame = frame;
};
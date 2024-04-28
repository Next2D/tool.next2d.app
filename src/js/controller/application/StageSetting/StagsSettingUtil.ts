/**
 * @type {number}
 * @private
 */
let $beforeWidth: number = 0;

/**
 * @description ステージの変更前の幅をセット
 *              Set the width of the stage change magic
 *
 * @param  {number} width
 * @return {void}
 * @method
 * @public
 */
export const $setBeforeWidth = (width: number): void =>
{
    $beforeWidth = width;
};

/**
 * @description ステージの変更前の幅を返却
 *              Returns the width of the stage change magic
 *
 * @return {number}
 * @method
 * @public
 */
export const $getBeforeWidth = (): number =>
{
    return $beforeWidth;
};

/**
 * @type {number}
 * @private
 */
let $beforeHeight: number = 0;

/**
 * @description ステージの変更前の高さをセット
 *              Set the height of the stage change magic
 *
 * @param  {number} heigth
 * @return {void}
 * @method
 * @public
 */
export const $setBeforeHeight = (heigth: number): void =>
{
    $beforeHeight = heigth;
};

/**
 * @description ステージの変更前の高さを返却
 *              Returns the height of the stage change magic
 *
 * @return {number}
 * @method
 * @public
 */
export const $getBeforeHeight = (): number =>
{
    return $beforeHeight;
};

/**
 * @type {number}
 * @private
 */
let $beforeFps: number = 0;

/**
 * @description ステージのフレームレートをセット
 *              Set the height of the stage change magic
 *
 * @param  {number} fps
 * @return {void}
 * @method
 * @public
 */
export const $setBeforeFps = (fps: number): void =>
{
    $beforeFps = fps;
};

/**
 * @description ステージのフレームレートを返却
 *              Returns the height of the stage change magic
 *
 * @return {number}
 * @method
 * @public
 */
export const $getBeforeFps = (): number =>
{
    return $beforeFps;
};
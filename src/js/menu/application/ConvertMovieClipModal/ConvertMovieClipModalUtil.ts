
/**
 * @description ConvertMovieClipModalの中心点の入力チェック状態
 *             Input check state of ConvertMovieClipModal center point
 *
 * @type {boolean}
 * @private
 */
let $selected: boolean = false;

/**
 * @description ConvertMovieClipModalの入力チェック状態
 *              Input check state of ConvertMovieClipModal
 *
 * @type {boolean}
 * @private
 */
let $validValue: boolean = false;

/**
 * @description ConvertMovieClipModalの入力チェック状態を初期化
 *              Initialize the input check state of ConvertMovieClipModal
 *
 * @return {void}
 * @method
 * @public
 */
export const $resetState = (): void =>
{
    $validValue = false;
    $selected   = false;
};

/**
 * @description ConvertMovieClipModalの入力チェック状態を取得
 *              Get the input check state of ConvertMovieClipModal
 *
 * @return {void}
 * @method
 * @public
 */
export const $selectReference = (): void =>
{
    $selected = true;
};

/**
 * @description ConvertMovieClipModalの入力チェック状態をセット
 *              Set the input check state of ConvertMovieClipModal
 *
 * @param  {boolean} valid
 * @return {void}
 * @method
 * @public
 */
export const $verifyValue = (valid: boolean): void =>
{
    $validValue = valid;
};

/**
 * @description ConvertMovieClipModalの入力チェック状態を取得
 *              Get the input check state of ConvertMovieClipModal
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $canProceed = (): boolean =>
{
    return $selected && $validValue;
};
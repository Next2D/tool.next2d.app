
/**
 * @description ConvertMovieClipModalの選択した中心点のElement ID
 *              Selected center point Element ID of ConvertMovieClipModal
 *
 * @type {string}
 * @private
 */
let $selectedElementId: string = "";

/**
 * @description ConvertMovieClipModalの入力チェック状態
 *              Input check state of ConvertMovieClipModal
 *
 * @type {boolean}
 * @private
 */
let $validValue: boolean = false;

/**
 * @description ConvertMovieClipModalの選択した中心点のElement IDを取得
 *              Get the selected center point Element ID of ConvertMovieClipModal
 *
 * @return {string}
 * @method
 * @public
 */
export const $getSelectedElementId = (): string =>
{
    return $selectedElementId;
};

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
    $selectedElementId = "";
};

/**
 * @description ConvertMovieClipModalの入力チェック状態を取得
 *              Get the input check state of ConvertMovieClipModal
 *
 * @param  {string} selected_element_id
 * @return {void}
 * @method
 * @public
 */
export const $selectReference = (selected_element_id: string): void =>
{
    $selectedElementId = selected_element_id;
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
    return $selectedElementId !== "" && $validValue;
};
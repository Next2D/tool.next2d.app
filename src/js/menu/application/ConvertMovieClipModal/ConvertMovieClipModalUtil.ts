
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
 * @description アンカー位置の割合
 *              Anchor position ratio
 *
 * @type {Record<string, [number, number]>}
 * @private
 */
export const $anchorFrac: Record<string, [number, number]> = {
    "top-left":      [0,   0],
    "middle-left":   [0.5, 0],
    "bottom-left":   [1,   0],
    "top-center":    [0,   0.5],
    "middle-center": [0.5, 0.5],
    "bottom-center": [1,   0.5],
    "top-right":     [0,   1],
    "middle-right":  [0.5, 1],
    "bottom-right":  [1,   1]
};

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
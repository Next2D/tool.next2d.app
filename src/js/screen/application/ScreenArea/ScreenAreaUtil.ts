/**
 * @type {boolean}
 * @default false
 * @private
 */
let $reDrawState: boolean = false;

/**
 * @description スクリーンエリアの再描画状態を設定
 *              Set the redraw state of the screen area
 *
 * @param {boolean} state
 * @return {void}
 * @public
 */
export const $setReDrawState = (state: boolean): void =>
{
    $reDrawState = state;
};

/**
 * @description スクリーンエリアの再描画状態を返却
 *              Returns the redraw state of the screen area
 *
 * @return {boolean}
 * @public
 */
export const $getReDrawState = (): boolean =>
{
    return $reDrawState;
};

/**
 * @type {boolean}
 * @default false
 * @private
 */
let $deactivated: boolean = false;

/**
 * @description Elementを非活性で生成するかどうかの状態を設定
 *              Set the state of whether to create an Element in an inactive state
 *
 * @param  {boolean} state
 * @return {void}
 * @public
 */
export const $setDeactivated = (state: boolean): void =>
{
    $deactivated = state;
};

/**
 * @description Elementを非活性で生成るかどうかの状態を返却
 *              Returns the state of whether to create an Element in an inactive state
 *
 * @return {boolean}
 * @public
 */
export const $getDeactivated = (): boolean =>
{
    return $deactivated;
};

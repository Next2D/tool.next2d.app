/**
 * @description タイムラインの移動待機状態
 *              Tool area in standby for movement
 *
 * @private
 */
let $standbyMove: boolean = false;

/**
 * @description タイムラインエリアの移動待機状態を取得
 *              Obtains the move standby status of the tool area
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $getStandbyMoveState = (): boolean =>
{
    return $standbyMove;
};

/**
 * @description タイムラインエリアの移動待機状態を更新
 *              Update tool area move standby status
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $setStandbyMoveState = (state: boolean): void =>
{
    $standbyMove = state;
};

/**
 * @description ツールエリアでのマウス状態
 *              Mouse state in tool area
 *
 * @private
 */
let $mouseState: "up" | "down" = "up";

/**
 * @description ツールエリアでのマウス状態を取得
 *              Get mouse status in tool area
 *
 * @return {string}
 * @method
 * @public
 */
export const $getMouseState = (): "up" | "down" =>
{
    return $mouseState;
};

/**
 * @description ツールエリアでのマウス状態を更新
 *              Update mouse status in tool area
 *
 * @param  {string} state
 * @return {void}
 * @method
 * @public
 */
export const $setMouseState = (state: "up" | "down"): void =>
{
    $mouseState = state;
};
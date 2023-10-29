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
 * @description タイムラインエリアの移動状態
 *              Movement state of tool area
 *
 * @private
 */
let $timelineAreaState: "move" | "fixed" = "fixed";

/**
 * @description タイムラインエリアでの移動状態を取得
 *              Get move status in tool area
 *
 * @return {string}
 * @method
 * @public
 */
export const $getTimelineAreaState = (): "move" | "fixed" =>
{
    return $timelineAreaState;
};

/**
 * @description タイムラインエリアでの移動状態を更新
 *              Update movement status in tool area
 *
 * @param  {string} state
 * @return {void}
 * @method
 * @public
 */
export const $setTimelineAreaState = (state: "move" | "fixed"): void =>
{
    $timelineAreaState = state;
};
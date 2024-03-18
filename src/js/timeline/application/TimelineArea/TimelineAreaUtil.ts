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
 * @description タイムラインのOffsetTop
 *              Timeline OffsetTop
 *
 * @private
 */
let $timelineOffsetTop: number = 0;

/**
 * @description タイムラインエリアのOffsetTopの値を返却
 *              Returns the OffsetTop value of the timeline area
 *
 * @return {number}
 * @method
 * @public
 */
export const $getTimelineOffsetTop = (): number =>
{
    return $timelineOffsetTop;
};

/**
 * @description タイムラインエリアのOffsetTopの値を更新
 *              Update OffsetTop value in timeline area
 *
 * @return {number}
 * @method
 * @public
 */
export const $setTimelineOffsetTop = (offset_top: number): void =>
{
    $timelineOffsetTop = offset_top;
};
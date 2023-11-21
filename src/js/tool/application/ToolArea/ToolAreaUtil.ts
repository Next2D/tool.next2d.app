/**
 * @description ツールエリアの移動待機状態
 *              Tool area in standby for movement
 *
 * @private
 */
let $standbyMove: boolean = false;

/**
 * @description ツールエリアの移動待機状態を取得
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
 * @description ツールエリアの移動待機状態を更新
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
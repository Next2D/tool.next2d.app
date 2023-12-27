import { $FIXED_FRAME_COUNT } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineHeader } from "../domain/model/TimelineHeader";

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

/**
 * @description 移動してるx座標から最小のフレーム数を返却
 *              Return the minimum number of frames from the moving x-coordinate
 *
 * @return {number}
 * @method
 * @public
 */
export const $getLeftFrame = (): number =>
{
    const workSpace = $getCurrentWorkSpace();
    return 1 + Math.ceil(workSpace.scene.scrollX / (workSpace.timelineAreaState.frameWidth + 1));
};

/**
 * @description タイムラインの現在表示されてる最大フレーム数（最大フレーム数とは異なる）
 *              The maximum number of frames currently displayed in the timeline
 *              (different from the maximum number of frames)
 *
 * @return {number}
 * @method
 * @public
 */
export const $getRightFrame = (): number =>
{
    const workSpace = $getCurrentWorkSpace();
    return $getLeftFrame() + Math.ceil(
        timelineHeader.clientWidth / (workSpace.timelineAreaState.frameWidth + 1)
    );
};

/**
 * @description 移動可能な最大フレーム数
 *              Maximum number of frames that can be moved
 *
 * @return {number}
 * @method
 * @public
 */
export const $getMaxFrame = (): number =>
{
    const workSpace = $getCurrentWorkSpace();
    return workSpace.scene.totalFrame + $FIXED_FRAME_COUNT;
};

/**
 * @description 移動可能なスクロールxの値
 *              Moveable scroll x value
 *
 * @return {number}
 * @method
 * @public
 */
export const $getScrollLimitX = (): number =>
{
    const workSpace = $getCurrentWorkSpace();
    const width = workSpace.timelineAreaState.frameWidth + 1;
    return $getMaxFrame() * width - timelineHeader.clientWidth;
};

/**
 * @description タイムラインの自動移動モードの設定値
 *              Timeline auto move mode setting value
 *
 * @type {boolean}
 * @default false
 * @private
 */
let $moveMode: boolean = false;

/**
 * @description タイムラインの自動移動モードの設定を返却
 *              Return timeline auto move mode setting
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $getMoveMode = (): boolean =>
{
    return $moveMode;
};

/**
 * @description タイムラインの自動移動モードの設定を上書き
 *              Override timeline auto move mode setting
 *
 * @param  {boolean} move_mode
 * @return {void}
 * @method
 * @public
 */
export const $setMoveMode = (move_mode: boolean): void =>
{
    $moveMode = move_mode;
};

/**
 * @description タイムラインの全体のハイライト設定の状態値
 *              State value of the overall highlight setting for the timeline
 *
 * @type {boolean}
 * @default false
 * @private
 */
let $allLightMode: boolean = false;

/**
 * @description タイムラインの全体のハイライト設定の現在の状態の値を返却
 *              Returns the value of the current state of the highlight settings for the entire timeline
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $getAllLightMode = (): boolean =>
{
    return $allLightMode;
};

/**
 * @description タイムラインの全体のハイライト設定の状態の値を更新
 *              Update the value of the overall highlighting status of the timeline
 *
 * @param  {boolean} mode
 * @return {void}
 * @method
 * @public
 */
export const $setAllLightMode = (mode: boolean): void =>
{
    $allLightMode = mode;
};

/**
 * @description タイムラインの全体の非表示設定の状態値
 *              State value of the overall hide setting for the timeline
 *
 * @type {boolean}
 * @default false
 * @private
 */
let $allDisableMode: boolean = false;

/**
 * @description タイムラインの全体の非表設定の現在の状態の値を返却
 *              Returns the value of the current state of the entire non-table setting of the timeline
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $getAllDisableMode = (): boolean =>
{
    return $allDisableMode;
};

/**
 * @description タイムラインの全体の非表設定の状態の値を更新
 *              Update the value of the overall non-table setting status of the timeline
 *
 * @param  {boolean} mode
 * @return {void}
 * @method
 * @public
 */
export const $setAllDisableMode = (mode: boolean): void =>
{
    $allDisableMode = mode;
};

/**
 * @description タイムラインの全体のロック設定の状態値
 *              State value of the overall lock setting for the timeline
 *
 * @type {boolean}
 * @default false
 * @private
 */
let $allLockMode: boolean = false;

/**
 * @description タイムラインの全体のロック設定の現在の状態の値を返却
 *              Returns the value of the current state of the lock setting for the entire timeline
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $getAllLockMode = (): boolean =>
{
    return $allLockMode;
};

/**
 * @description タイムラインの全体のロック設定の状態の値を更新
 *              Update the value of the status of the overall lock setting on the timeline
 *
 * @param  {boolean} mode
 * @return {void}
 * @method
 * @public
 */
export const $setAllLockMode = (mode: boolean): void =>
{
    $allLockMode = mode;
};

/**
 * @description タイムラインのロック機能の利用状態の値
 *              Value of the timeline lock function usage status
 *
 * @type {boolean}
 * @default false
 * @private
 */
let $lockState: boolean = false;

/**
 * @description タイムラインのロック機能の利用状態の値を返却
 *              Returns the value of the usage status of the lock function of the timeline
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $getLockState = (): boolean =>
{
    return $lockState;
};

/**
 * @description タイムラインのロック機能の利用状態の値を更新
 *              Update timeline lock feature usage status value
 *
 * @param  {boolean} state
 * @return {void}
 * @method
 * @public
 */
export const $setLockState = (state: boolean): void =>
{
    $lockState = state;
};

/**
 * @description タイムラインの表示機能の利用状態の値
 *              Value of the usage status of the timeline display function.
 *
 * @type {boolean}
 * @default false
 * @private
 */
let $disableState: boolean = false;

/**
 * @description タイムラインの表示機能の利用状態の値を返却
 *              Returns the value of the usage status of the timeline display function.
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $getDisableState = (): boolean =>
{
    return $disableState;
};

/**
 * @description タイムラインの表示機能の利用状態の値を更新
 *              Update the value of the usage status of the timeline display function.
 *
 * @param  {boolean} state
 * @return {void}
 * @method
 * @public
 */
export const $setDisableState = (state: boolean): void =>
{
    $disableState = state;
};
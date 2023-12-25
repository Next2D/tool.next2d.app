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
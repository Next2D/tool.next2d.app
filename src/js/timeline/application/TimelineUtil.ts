import { TimelineHeader } from "../domain/model/TimelineHeader";
import { TimelineFrame } from "../domain/model/TimelineFrame";
import { TimelineLayer } from "../domain/model/TimelineLayer";

/**
 * @description フレームの幅の値
 *              Frame width value
 *
 * @typw {number}
 * @private
 */
let $timeline_frame_width: number = 13;

/**
 * @description 現在のフレームの幅の値を返却
 *              Returns the value of the current frame width
 *
 * @returns {number}
 * @method
 * @public
 */
export const $getTimelineFrameWidth = (): number =>
{
    return $timeline_frame_width;
};

/**
 * @description フレームの幅の値を更新
 *              Update frame width values
 *
 * @params  {number}
 * @returns {void}
 * @method
 * @public
 */
export const $setTimelineFrameWidth = (timeline_frame_width: number): void =>
{
    $timeline_frame_width = Math.min(260, Math.max(4, timeline_frame_width));
};

/**
 * @description タイムラインのヘッダー管理オブジェクト
 *              Timeline Header Management Objects
 *
 * @type {TimelineHeader}
 * @public
 */
export const timelineHeader: TimelineHeader = new TimelineHeader();

/**
 * @description タイムラインのフレーム管理オブジェクト
 *              Timeline Frame Management Objects
 *
 * @type {TimelineHeader}
 * @public
 */
export const timelineFrame: TimelineFrame = new TimelineFrame();

/**
 * @description タイムラインのレイヤー管理オブジェクト
 *              Timeline Layer Management Objects
 *
 * @type {TimelineLayer}
 * @public
 */
export const timelineLayer: TimelineLayer = new TimelineLayer();

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
 * @description 現在のxスクロール座標
 *              Current x-scroll coordinates
 *
 * @type {number}
 * @private
 */
let $scrollX: number = 0;

/**
 * @description タイムラインのスクロールx座標
 *              Scroll x-coordinate of timeline
 *
 * @return {number}
 * @method
 * @public
 */
export const $getScrollX = (): number =>
{
    return $scrollX;
};

/**
 * @description タイムラインのスクロールx座標を更新
 *              Update timeline scroll x-coordinate
 *
 * @param  {number} x
 * @return {void}
 * @method
 * @public
 */
export const $setScrollX = (x: number): void =>
{
    $scrollX = x;
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
    return 1 + $scrollX / $timeline_frame_width | 0;
};
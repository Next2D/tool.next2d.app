import { TimelineHeader } from "../domain/model/TimelineHeader";
import { TimelineFrame } from "../domain/model/TimelineFrame";

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
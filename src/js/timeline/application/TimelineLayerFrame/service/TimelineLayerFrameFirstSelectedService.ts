import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description タイムラインのマウスダウンで選択した最初のフレームをセット
 *              Set first frame selected with mouse down on timeline
 *
 * @param  {number} frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (frame: number): void =>
{
    // 初期化
    timelineLayer.clear();

    // 選択した最初のフレームをセット
    timelineLayer.selectedFrameObject.start = frame;
    timelineLayer.selectedFrameObject.end   = frame;
};
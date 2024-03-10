import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description タイムラインのマウスダウンで選択した最初のフレームとレイヤーをセット
 *              Set first frame and layer selected with mouse down on timeline
 *
 * @param  {number} frame
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (frame: number, layer: Layer): void =>
{
    // 初期化
    timelineLayer.clear();

    // 選択した最初のフレームをセット
    timelineLayer.selectedFrameObject.start = frame;
    timelineLayer.selectedFrameObject.end   = frame;

    // 選択したレイヤーをセット
    timelineLayer.selectedLayers.push(layer);
};
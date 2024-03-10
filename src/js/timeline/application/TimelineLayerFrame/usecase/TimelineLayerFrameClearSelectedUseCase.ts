import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerDeactivatedElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerDeactivatedElementService";

/**
 * @description タイムラインのマウスダウンで選択した最初のフレームとレイヤーをセット
 *              Set first frame and layer selected with mouse down on timeline
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    for (let idx = 0; idx < timelineLayer.selectedLayers.length; ++idx) {

        // フレームの表示を初期化
        const layer = timelineLayer.selectedLayers[idx];
        timelineLayerDeactivatedElementService(layer, false);

        // レイヤーの内部情報を初期化
        layer.clear();
    }
};
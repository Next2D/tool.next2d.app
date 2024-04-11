import { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerControllerUpdateColorElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateColorElementService";
import { execute as timelineLayerControllerUpdateLightIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateLightIconElementService";

/**
 * @description レイヤーのハイライト表示を更新
 *              Updated layer highlighting
 *
 * @param {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    // ハイライトカラーを更新
    timelineLayerControllerUpdateColorElementService(layer);

    // ハイライトの機能がonの時は表示も更新
    if (layer.light) {
        timelineLayerControllerUpdateLightIconElementService(layer);
    }
};
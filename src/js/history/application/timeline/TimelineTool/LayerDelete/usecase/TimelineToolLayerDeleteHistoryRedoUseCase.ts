import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerElementDisplayNoneService } from "@/timeline/application/TimelineLayer/service/TimelineLayerElementUpdateDisplayService";

/**
 * @description レイヤー削除を再度実行する
 *              Execute layer deletion again.
 *
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    // // Layer Objectを内部情報から削除
    const scene = $getCurrentWorkSpace().scene;
    scene.removeLayer(layer);

    // 対象のElementを非表示する
    timelineLayerElementDisplayNoneService(layer.id, "none");
};
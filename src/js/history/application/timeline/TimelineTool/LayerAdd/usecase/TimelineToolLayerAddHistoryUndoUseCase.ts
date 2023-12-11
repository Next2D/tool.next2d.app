import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerElementDisplayNoneService } from "@/timeline/application/TimelineLayer/service/TimelineLayerElementDisplayNoneService";

/**
 * @description レイヤー追加作業を元に戻す
 *              Undo the layer addition process
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    // Layer Objectを内部情報から削除
    const scene = $getCurrentWorkSpace().scene;
    scene.removeLayer(layer.id);

    // 対象のElementを非表示に
    timelineLayerElementDisplayNoneService(layer.id);
};
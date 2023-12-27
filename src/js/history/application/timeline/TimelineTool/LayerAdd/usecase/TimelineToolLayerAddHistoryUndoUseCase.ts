import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerElementUpdateDisplayService } from "@/timeline/application/TimelineLayer/service/TimelineLayerElementUpdateDisplayService";

/**
 * @description レイヤー追加作業を元に戻す
 *              Undo the layer addition process
 *
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    // Layer Objectを内部情報から削除
    const scene = $getCurrentWorkSpace().scene;
    scene.removeLayer(layer);

    // 対象のElementを非表示にする
    timelineLayerElementUpdateDisplayService(layer.id, "none");
};
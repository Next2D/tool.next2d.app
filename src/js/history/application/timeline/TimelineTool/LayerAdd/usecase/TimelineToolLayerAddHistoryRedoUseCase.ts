import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerElementUpdateDisplayService } from "@/timeline/application/TimelineLayer/service/TimelineLayerElementUpdateDisplayService";

/**
 * @description レイヤー追加作業を元に戻す
 *              Undo the layer addition process
 *
 * @param  {Layer}  layer
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer, index: number): void =>
{
    // Layer Objectを内部情報から削除
    const scene = $getCurrentWorkSpace().scene;
    scene.setLayer(layer, index);

    // 対象のElementを表示する
    timelineLayerElementUpdateDisplayService(layer.id, "");
};
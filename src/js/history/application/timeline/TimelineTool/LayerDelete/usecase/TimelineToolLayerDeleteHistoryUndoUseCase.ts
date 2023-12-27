import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerElementDisplayNoneService } from "@/timeline/application/TimelineLayer/service/TimelineLayerElementUpdateDisplayService";

/**
 * @description 削除したレイヤーを元の配置に元に戻す
 *              Restore deleted layers to their original placement
 *
 * @param  {Layer} layer
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer, index: number): void =>
{
    // Layer Objectを内部情報に再登録
    const scene = $getCurrentWorkSpace().scene;
    scene.setLayer(layer, index);

    // 対象のElementを非表示にする
    timelineLayerElementDisplayNoneService(layer.id, "");
};
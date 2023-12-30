import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerElementUpdateDisplayService } from "@/timeline/application/TimelineLayer/service/TimelineLayerElementUpdateDisplayService";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";
import { execute as timelineLayerInactiveElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerInactiveElementService";

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

    // 対象のレイヤーElementを非アクティブに更新
    timelineLayerInactiveElementService(layer.id);

    // タイムラインのyスクロールの高さを更新
    timelineScrollUpdateHeightService();
};
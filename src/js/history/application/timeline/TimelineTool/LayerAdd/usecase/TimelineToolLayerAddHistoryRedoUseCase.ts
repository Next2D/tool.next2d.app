import type { Layer } from "@/core/domain/model/Layer";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";

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
    // Layerオブジェクトの内部情報から削除
    $getCurrentWorkSpace()
        .scene
        .setLayer(layer, index);

    // タイムラインのyスクロールの高さを更新
    timelineScrollUpdateHeightService();

    // タイムラインを再描画
    timelineLayerBuildElementUseCase();
};
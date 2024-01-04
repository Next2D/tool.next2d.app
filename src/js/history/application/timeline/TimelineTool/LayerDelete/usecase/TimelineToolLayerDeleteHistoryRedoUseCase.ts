import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";

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
    // Layerオブジェクトの内部情報から削除
    $getCurrentWorkSpace()
        .scene
        .removeLayer(layer);

    // タイムラインのyスクロールの高さを更新
    timelineScrollUpdateHeightService();

    // タイムラインを再描画
    timelineLayerBuildElementUseCase();
};
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as layerUpdateLightColorHistoryUseCase } from "@/history/application/core/application/Layer/usecase/LayerUpdateLightColorHistoryUseCase";
import { execute as timelineLayerControllerUpdateColorElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateColorElementService";
import { execute as timelineLayerControllerUpdateLightIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateLightIconElementService";

/**
 * @description レイヤーのハイライト表示を更新
 *              Updated layer highlighting
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {string} color
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    color: string,
    receiver: boolean = false
): void => {

    // 変更前のカラーを取得
    const beforeColor = layer.color;

    // Layerオブジェクトの値を更新
    layer.color = color;

    // 履歴に追加
    // fixed logic
    layerUpdateLightColorHistoryUseCase(
        work_space, movie_clip, layer, beforeColor, receiver
    );

    // アクティブな場合のみ処理を行う
    if (work_space.active && movie_clip.active) {
        // ハイライトカラーを更新
        timelineLayerControllerUpdateColorElementService(layer, layer.color);

        // ハイライトの機能がonの時は表示も更新
        if (layer.light) {
            timelineLayerControllerUpdateLightIconElementService(layer, layer.light);
        }
    }
};
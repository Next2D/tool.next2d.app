import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as layerUpdateLightColorHistoryUseCase } from "@/history/application/core/application/Layer/UpdateLight/usecase/LayerUpdateLightColorHistoryUseCase";
import { execute as timelineLayerControllerUpdateColorUseCase } from "@/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerUpdateColorUseCase";

/**
 * @description レイヤーのハイライト表示を更新
 *              Updated layer highlighting
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {string} color
 * @param  {boolean} [receiver=false]
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    color: string,
    receiver: boolean = false
): Promise<void> => {

    // 変更前のカラーを取得
    const beforeColor = layer.color;

    // Layerオブジェクトの値を更新
    layer.color = color;

    // 履歴に追加
    // fixed logic
    await layerUpdateLightColorHistoryUseCase(
        work_space, movie_clip, layer, beforeColor, receiver
    );

    // アクティブな場合のみ処理を行う
    if (work_space.active && movie_clip.active) {
        // ハイライトカラーを更新
        timelineLayerControllerUpdateColorUseCase(layer);
    }
};
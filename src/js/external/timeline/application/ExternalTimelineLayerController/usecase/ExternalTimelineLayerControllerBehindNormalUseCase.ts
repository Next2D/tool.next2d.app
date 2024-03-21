import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineLayerControllerMoveLayerHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerController/MoveLayer/usecase/TimelineLayerControllerMoveLayerHistoryUseCase";

/**
 * @description 指定のレイヤーの後ろに選択中のレイヤーを移動
 *              Move the selected layer behind the specified layer
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} dist_layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    dist_layer: Layer
): void => {

    // MovieClipのレイヤー配列を取得
    const layers = movie_clip.layers;

    // 選択配列を複製
    const selectedLayers = movie_clip.selectedLayers.slice();

    // index順に並び替え
    selectedLayers.sort((a: Layer, b: Layer): number =>
    {
        return layers.indexOf(a) - layers.indexOf(b);
    });

    // レイヤーの移動を実行
    for (let idx = 0; idx < selectedLayers.length; idx++) {

        const layer = selectedLayers[idx];

        // 移動前のindex値を取得
        const beforeIndex = layers.indexOf(layer);

        // 配列から削除
        layers.splice(beforeIndex, 1);

        // レイヤーを移動
        const afterIndex = layers.indexOf(dist_layer) + idx + 1;

        // 変更がなければスキップ
        if (beforeIndex === afterIndex) {
            // 削除したレイヤーを元のindex値に戻す
            layers.splice(beforeIndex, 0, layer);
            continue;
        }

        // 指定のindexにレイヤーを移動
        layers.splice(afterIndex, 0, layer);

        // 履歴に登録
        // fixed logic
        timelineLayerControllerMoveLayerHistoryUseCase(
            work_space,
            movie_clip,
            layer,
            beforeIndex,
            afterIndex
        );

        // 通常レイヤ移動の場合は親子関係を解除
        // fixed logic
        layer.clearRelation();
    }

    // タイムラインを再描画
    if (work_space.active && movie_clip.active) {
        timelineLayerBuildElementUseCase();
    }
};
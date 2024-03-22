import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineLayerControllerMoveLayerHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerController/MoveLayer/usecase/TimelineLayerControllerMoveLayerHistoryUseCase";
import { execute as timelineLayerControllerUpdateIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateIconElementService";
import { LayerModeImpl } from "@/interface/LayerModeImpl";

/**
 * @description マスク、ガイドレイヤーの親子関係を考慮してレイヤーを移動
 *              Move the layer considering the parent-child relationship of the mask and guide layers
 *
 * @param {WorkSpace} work_space
 * @param {MovieClip} movie_clip
 * @param {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    index: number
): void => {

    // MovieClipのレイヤー配列を取得
    const layers = movie_clip.layers;

    // 移動先のレイヤーを取得
    const distLayer = layers[index];

    // 複製して親子関係がないかチェック
    const selectedLayers = movie_clip.selectedLayers.slice();

    // 移動するレイヤーの中に、親レイヤーが含まれていたら処理を終了
    for (let idx = 0; idx < selectedLayers.length; idx++) {
        const layer = selectedLayers[idx];
        switch (layer.mode) {

            case 1: // マスクレイヤー
            case 3: // ガイドレイヤー
                return ;

            default:
                break;

        }
    }

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
        const afterIndex = layers.indexOf(distLayer) + idx + 1;

        // 移動先が移動元と同じ場合は親レイヤーの中に移動する
        if (beforeIndex === afterIndex) {
            // 削除したレイヤーを元のindex値に戻す
            layers.splice(beforeIndex, 0, layer);
        } else {
            // 指定のindexにレイヤーを移動
            layers.splice(afterIndex, 0, layer);
        }

        // 履歴に登録
        // fixed logic
        timelineLayerControllerMoveLayerHistoryUseCase(
            work_space,
            movie_clip,
            layer,
            beforeIndex,
            afterIndex
        );
    }

    let mode: LayerModeImpl = 0;
    switch (distLayer.mode) {

        case 1: // マスクレイヤー
            mode = 2;
            break;

        case 3: // ガイドレイヤー
            mode = 4;
            break;

        default:
            break;

    }

    const parentIndex = layers.indexOf(distLayer);
    for (let idx = 0; idx < selectedLayers.length; idx++) {
        const layer = selectedLayers[idx];

        // 親子関係を設定
        layer.mode = mode;
        layer.parentIndex = parentIndex;

        // アクティブならアイコン表示を更新
        if (work_space.active && movie_clip.active) {
            timelineLayerControllerUpdateIconElementService(layer);
        }
    }

    // タイムラインを再描画
    if (work_space.active && movie_clip.active) {
        timelineLayerBuildElementUseCase();
    }
};
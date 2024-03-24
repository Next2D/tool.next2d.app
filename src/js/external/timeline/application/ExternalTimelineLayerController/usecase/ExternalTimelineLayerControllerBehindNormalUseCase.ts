import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineLayerControllerMoveLayerHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerController/MoveLayer/usecase/TimelineLayerControllerMoveLayerHistoryUseCase";
import { execute as externalTimelineLayerControllerCorrectionRelationshipService } from "../service/ExternalTimelineLayerControllerCorrectionRelationshipService";
import {
    $GUIDE_MODE,
    $MASK_MODE
} from "@/config/LayerModeConfig";

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

    // 選択配列を複製してindex順に並び替え
    const selectedLayers = movie_clip.selectedLayers.slice();
    selectedLayers.sort((a: Layer, b: Layer): number =>
    {
        return layers.indexOf(a) - layers.indexOf(b);
    });

    // レイヤーの移動を実行
    const parentMap = new Map<number, boolean>();
    let adjustmentIndex = 0;
    for (let idx = 0; idx < selectedLayers.length; idx++) {

        const layer = selectedLayers[idx];

        // 子のレイヤーで親が選択されている場合は選択配列から削除してidxを補正
        if (layer.parentId !== -1) {
            if (!parentMap.has(layer.parentId)) {
                let index = layers.indexOf(layer) - 1;
                for (; index > -1; --index) {

                    const parentLayer = movie_clip.layers[index];
                    if (parentLayer.id !== layer.parentId) {
                        continue;
                    }

                    if (selectedLayers.indexOf(parentLayer) === -1) {
                        continue;
                    }

                    selectedLayers.splice(idx, 1);
                    idx -= 1;

                    // 親のレイヤーIDをマップに登録
                    parentMap.set(parentLayer.id, true);
                    break;
                }
            }

            if (parentMap.has(layer.parentId)) {
                continue;
            }
        }

        // 移動前のindex値を取得
        const beforeIndex = layers.indexOf(layer);

        // 配列から削除
        layers.splice(beforeIndex, 1);

        // レイヤーを移動
        const afterIndex = layers.indexOf(dist_layer) + adjustmentIndex + idx + 1;

        // 変更がない場合は、削除したレイヤーを元のindex値に戻して終了
        if (beforeIndex === afterIndex) {
            layers.splice(beforeIndex, 0, layer);
            continue;
        }

        // 指定のindexにレイヤーを移動
        layers.splice(afterIndex, 0, layer);

        const beforeMode = layer.mode;
        const beforeParentId = layer.parentId;

        switch (layer.mode) {

            case $MASK_MODE: // マスクレイヤーの場合
            case $GUIDE_MODE: // ガイドレイヤーの場合
                adjustmentIndex += externalTimelineLayerControllerCorrectionRelationshipService(
                    movie_clip, layer, beforeIndex
                );
                break;

            default:
                // 親子関係を解除
                layer.clearRelation();
                break;

        }

        // 履歴に登録
        // fixed logic
        timelineLayerControllerMoveLayerHistoryUseCase(
            work_space,
            movie_clip,
            layer,
            beforeIndex,
            layers.indexOf(layer), // 親レイヤーの場合は補正が入るので、indexOfで取得,
            beforeMode,
            beforeParentId
        );
    }

    // タイムラインを再描画
    if (work_space.active && movie_clip.active) {
        timelineLayerBuildElementUseCase();
    }
};
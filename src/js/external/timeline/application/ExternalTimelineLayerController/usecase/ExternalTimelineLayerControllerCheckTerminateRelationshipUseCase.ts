import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as externalTimelineLayerControllerBehindRelationUseCase } from "./ExternalTimelineLayerControllerBehindRelationUseCase";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineLayerControllerMoveLayerHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerController/MoveLayer/usecase/TimelineLayerControllerMoveLayerHistoryUseCase";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description レイヤーの親子関係性をチェックする
 *              Check the parent-child relationship of the layer
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    index: number
): void => {

    if (timelineLayer.exitMode) {

        const layers = movie_clip.layers;

        // 移動先のレイヤーを取得
        const distLayer = layers[index];

        // マスクの最後の子レイヤーのインデックスを取得
        let exitIndex = index;
        for (let idx = index; idx < layers.length; ++idx) {
            const layer = layers[idx];
            if (layer.parentId !== distLayer.parentId) {
                break;
            }
            exitIndex = idx;
        }

        // 最後の子レイヤーを取得
        let targetLayer = layers[exitIndex];

        // 複製して並び替えを実行
        const selectedLayers = movie_clip.getCloneAndSortSelectedLayers();

        // 親レイヤーのIDを固定変数としてセット
        const parentId = distLayer.parentId;
        for (let idx = 0; idx < selectedLayers.length; ++idx) {

            const layer = selectedLayers[idx];
            if (layer.parentId !== parentId) {
                continue;
            }

            // 変更前の情報を取得
            const beforeIndex    = layers.indexOf(layer);
            const beforeMode     = layer.mode;
            const beforeParentId = layer.parentId;

            // 子レイヤーを解除
            layer.clearRelation();

            // レイヤーを配列から一度削除
            layers.splice(beforeIndex, 1);

            // 最後の子レイヤーの後ろに挿入
            const targetIndex = layers.indexOf(targetLayer);
            if (targetIndex > -1) {
                layers.splice(targetIndex + 1, 0, layer);
            } else {
                layers.splice(beforeIndex, 0, layer);
            }

            // 履歴を登録
            timelineLayerControllerMoveLayerHistoryUseCase(
                work_space,
                movie_clip,
                layer,
                beforeIndex,
                layers.indexOf(layer),
                beforeMode,
                beforeParentId
            );

            // 移動したレイヤーを挿入先のレイヤーに更新
            targetLayer = layer;
        }

        if (work_space.active && movie_clip.active) {
            timelineLayerBuildElementUseCase();
        }

    }  else {
        // 親子関係の解除がなければ通常の移動処理を行う
        externalTimelineLayerControllerBehindRelationUseCase(
            work_space,
            movie_clip,
            index
        );
    }
};
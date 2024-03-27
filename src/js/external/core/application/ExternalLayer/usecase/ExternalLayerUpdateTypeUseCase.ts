import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { LayerTypeImpl } from "@/interface/LayerTypeImpl";
import { execute as timelineLayerControllerUpdateIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateIconElementService";
import { execute as externalLayerGetLayerModeService } from "../service/ExternalLayerGetLayerModeService";
import { execute as layerUpdateModeHistoryUseCase } from "@/history/application/core/application/Layer/usecase/LayerUpdateModeHistoryUseCase";
import { $GUIDE_MODE, $MASK_MODE } from "@/config/LayerModeConfig";

/**
 * @description レイヤータイプの更新
 *              Layer type update
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {string} type
 * @param  {boolean} [receiver = false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    type: LayerTypeImpl,
    receiver: boolean = false
): void => {

    // 変更前の情報をセット
    const beforeMode = layer.mode;
    const beforeParentId = layer.parentId;

    // 変更がなけれな終了(連続実行防止)
    const afterMode = externalLayerGetLayerModeService(type);
    if (beforeMode === afterMode) {
        return ;
    }

    const indexes = [];
    switch (layer.mode) {

        case $MASK_MODE:
        case $GUIDE_MODE:
            {
                const index = movie_clip.layers.indexOf(layer);
                for (let idx = index + 1; idx < movie_clip.layers.length; ++idx) {
                    const childLayer = movie_clip.layers[idx];
                    if (childLayer.parentId !== layer.id) {
                        break;
                    }

                    // 親子関係を解除したindexを保存
                    indexes.push(idx);

                    // 通常レイヤーに変更
                    childLayer.clearRelation();

                    if (work_space.active && movie_clip.active) {
                        timelineLayerControllerUpdateIconElementService(childLayer);
                    }
                }
            }
            break;

        default:
            break;

    }

    // 初期化
    layer.clearRelation();
    layer.mode = afterMode;

    // 履歴に追加
    // fixed logic
    layerUpdateModeHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        beforeMode,
        beforeParentId,
        indexes,
        receiver
    );

    // アクティブなら表示を更新
    if (work_space.active && movie_clip.active) {
        timelineLayerControllerUpdateIconElementService(layer);
    }
};
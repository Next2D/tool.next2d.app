import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { LayerModeStringImpl } from "@/interface/LayerModeSringImpl";
import { execute as timelineLayerControllerUpdateIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateIconElementService";
import { execute as externalLayerGetLayerModeService } from "../service/ExternalLayerGetLayerModeService";

/**
 * @description レイヤータイプの更新
 *              Layer type update
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {string} type
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    type: LayerModeStringImpl
): void => {

    const beforeMode = layer.mode;
    const afterMode  = externalLayerGetLayerModeService(type);

    // 変更がなけれな終了(連続実行防止)
    if (beforeMode === afterMode) {
        return ;
    }

    layer.parentIndex = null;
    layer.mode = afterMode;

    // TODO 履歴に追加
    console.log(beforeMode);

    // アクティブなら表示を更新
    if (work_space.active && movie_clip.active) {
        timelineLayerControllerUpdateIconElementService(layer, layer.mode);
    }
};
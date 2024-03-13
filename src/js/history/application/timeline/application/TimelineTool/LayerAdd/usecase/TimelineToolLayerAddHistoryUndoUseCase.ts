import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { execute as externalLayerUpdateReloadUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateReloadUseCase";

/**
 * @description レイヤー追加作業を元に戻す
 *              Undo the layer addition process
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    index: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    const layer = movieClip.layers[index];
    if (!layer) {
        return ;
    }

    // 外部APIを起動
    const externalLayer = new ExternalLayer(workSpace, movieClip, layer);
    const externalTimeline = new ExternalTimeline(workSpace, movieClip);

    // 非アクティブに更新
    externalTimeline.deactivatedLayer([externalLayer.index]);

    // Layerオブジェクトの内部情報から削除
    movieClip.deleteLayer(layer);

    // レイヤー更新によるタイムラインの再描画
    if (workSpace.active && movieClip.active) {
        externalLayerUpdateReloadUseCase();
    }
};
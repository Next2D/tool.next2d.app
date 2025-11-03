import { $getWorkSpace } from "@/core/application/CoreUtil";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { execute as viewTimelineLayerDeleteUseCase } from "@/view/timeline/TimelineLayer/usecase/ViewTimelineLayerDeleteUseCase";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";

/**
 * @description レイヤー削除を再度実行する
 *              Execute layer deletion again.
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {array} indexes
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    index: number,
    indexes: number[]
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip = workSpace.getLibrary(library_id) as MovieClip;
    if (!movieClip) {
        return ;
    }

    const layer = movieClip.getLayer(index);
    if (!layer) {
        return ;
    }

    for (let idx = 0; idx < indexes.length; ++idx) {
        const childLayer = movieClip.getLayer(index);
        if (!childLayer) {
            return ;
        }

        // 通常レイヤーに更新
        childLayer.clearRelation();
    }

    // 外部APIを起動
    const externalTimeline = new ExternalTimeline(workSpace, movieClip);

    // 選択中であれば非アクティブに更新
    externalTimeline.deactivatedLayer([index]);

    // 内部情報から削除
    movieClip.deleteLayer(layer);

    // 全ての先祖のキャッシュを削除
    cacheRemoveService(workSpace, movieClip.id);

    // Viewの更新
    const activeCharacters = layer.getActiveCharacters(movieClip.currentFrame);
    await viewTimelineLayerDeleteUseCase(
        workSpace,
        movieClip,
        activeCharacters.length > 0
    );
};
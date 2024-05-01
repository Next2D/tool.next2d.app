import { $getWorkSpace } from "@/core/application/CoreUtil";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { execute as externalLayerUpdateReloadUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateReloadUseCase";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as screenAreaHideTargetRectElementService } from "@/screen/application/ScreenArea/service/ScreenAreaHideTargetRectElementService";

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

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
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

    // レイヤー更新によるタイムラインの再描画
    if (workSpace.active && movieClip.active) {
        externalLayerUpdateReloadUseCase();

        // スクリーンの選択範囲elementを非表示
        screenAreaHideTargetRectElementService();

        const activeCharacters = layer.getActiveCharacters(movieClip.currentFrame);
        if (activeCharacters.length) {
            await screenAreaRedrawUseCase(movieClip);
        }
    }
};
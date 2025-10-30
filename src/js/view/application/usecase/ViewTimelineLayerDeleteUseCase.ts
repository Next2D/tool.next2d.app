import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalLayerUpdateReloadUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateReloadUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as targetRectHideElementService } from "@/screen/application/TargetRect/service/TargetRectHideElementService";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";

/**
 * @description タイムラインのレイヤー削除後の表示処理
 *              Display processing after deleting a layer from the timeline
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {boolean} reload
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    reload: boolean = true
): Promise<void> => {

    if (!work_space.active) {
        return ;
    }

    // アクティブならタイムラインを再描画
    if (movie_clip.active) {
        externalLayerUpdateReloadUseCase();

        // スクリーンの選択範囲elementを非表示
        targetRectHideElementService();

        // 変形の中心点の表示を更新
        screenReferencePointDeployElementUseCase();

        if (reload) {
            await screenAreaRedrawUseCase(movie_clip);
        }
    } else {
        await screenAreaRedrawUseCase(work_space.scene);
    }
};
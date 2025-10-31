import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as screenDisplayObjectAllSelectedActiveUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectAllSelectedActiveUseCase";

/**
 * @description タイムラインのキーフレーム削除後のView更新
 *              View Update After Timeline Keyframe Deletion
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {boolean} [reload=true]
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer
): Promise<void> => {

    if (!work_space.active) {
        return ;
    }

    // 変形の中心点の表示を更新
    screenReferencePointDeployElementUseCase();

    // 選択範囲のElementを移動
    targetRectUpdateElementUseCase();

    if (movie_clip.active) {

        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(movie_clip, layer);

        // 画面を再描画
        await screenAreaRedrawUseCase(movie_clip);

        // 選択中のDisplayObjectをアクティブ表示に更新
        // fixed logic
        screenDisplayObjectAllSelectedActiveUseCase(movie_clip);
    } else {
        // 画面を再描画
        await screenAreaRedrawUseCase(work_space.scene);

        // 選択中のDisplayObjectをアクティブ表示に更新
        // fixed logic
        screenDisplayObjectAllSelectedActiveUseCase(work_space.scene);
    }
};
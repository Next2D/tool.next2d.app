import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";
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
    reload: boolean = true
): Promise<void> => {

    if (!work_space.active) {
        return ;
    }

    // 変形の中心点の表示を更新
    screenReferencePointDeployElementUseCase();

    // 選択範囲のElementを移動
    targetRectUpdateElementUseCase();

    if (movie_clip.active) {
        if (!reload) {
            return ;
        }

        await screenAreaRedrawUseCase(movie_clip);

        // 選択中のDisplayObjectをアクティブ表示に更新
        // fixed logic
        screenDisplayObjectAllSelectedActiveUseCase(movie_clip);
    } else {
        if (!reload) {
            return ;
        }

        const movieClip = work_space.scene;
        await screenAreaRedrawUseCase(movieClip);

        // 選択中のDisplayObjectをアクティブ表示に更新
        // fixed logic
        screenDisplayObjectAllSelectedActiveUseCase(movieClip);
    }
};
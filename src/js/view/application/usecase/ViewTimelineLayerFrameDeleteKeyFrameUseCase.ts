import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";

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

    if (movie_clip.active) {
        // 変形の中心点の表示を更新
        screenReferencePointDeployElementUseCase();

        if (reload) {
            await screenAreaRedrawUseCase(movie_clip);
        }
    } else {
        if (reload) {
            await screenAreaRedrawUseCase(work_space.scene);
        }
    }
};
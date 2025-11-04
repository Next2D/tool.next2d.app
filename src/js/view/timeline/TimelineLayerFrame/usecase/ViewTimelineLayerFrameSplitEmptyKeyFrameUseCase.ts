import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as screenDisplayObjectAllSelectedActiveUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectAllSelectedActiveUseCase";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type{ MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description 空のキーフレームを追加した際のViewエリアの表示要素を更新
 *              Update the display elements in the View area when an empty keyframe is added
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
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

    // 選択範囲のElementの表示を更新
    targetRectUpdateElementUseCase();

    // 変形の中心点の表示を更新
    screenReferencePointDeployElementUseCase();

    // アクティブならタイムラインを再描画
    if (movie_clip.active) {
        if (!reload) {
            return ;
        }

        // スクリーンを再描画
        await screenAreaRedrawUseCase(movie_clip);

        // 再描画したので、選択中のElementをアクティブにする
        // fixed logic
        screenDisplayObjectAllSelectedActiveUseCase(movie_clip);
    } else {
        // スクリーンを再描画
        const movieClip = work_space.scene;
        await screenAreaRedrawUseCase(movieClip);

        // 再描画したので、選択中のElementをアクティブにする
        // fixed logic
        screenDisplayObjectAllSelectedActiveUseCase(movieClip);
    }
};
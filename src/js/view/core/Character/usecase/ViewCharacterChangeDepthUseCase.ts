import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as screenDisplayObjectAllSelectedActiveUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectAllSelectedActiveUseCase";

/**
 * @description 指定キャラクターの深度変更に伴うViewの更新
 *              Update View Accompanying Depth Change of Specified Character
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip
): Promise<void> => {

    // プロジェクトがアクティブでなければ終了
    if (!work_space.active) {
        return ;
    }

    if (movie_clip.active) {
        // 画面を再描画
        await screenAreaRedrawUseCase(movie_clip);

        // 再描画したので、選択中のElementをアクティブにする
        // fixed logic
        screenDisplayObjectAllSelectedActiveUseCase(movie_clip);
    } else {
        const movieClip = work_space.scene;

        // 画面を再描画
        await screenAreaRedrawUseCase(movieClip);

        // 再描画したので、選択中のElementをアクティブにする
        // fixed logic
        screenDisplayObjectAllSelectedActiveUseCase(movieClip);
    }
};
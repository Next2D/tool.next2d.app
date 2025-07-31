import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as targetRectHideElementService } from "@/screen/application/TargetRect/service/TargetRectHideElementService";
import { execute as propertyAreaChangeDisplayUseCase } from "@/controller/application/PropertyArea/usecase/PropertyAreaChangeDisplayUseCase";
import { execute as screenStandardPointDeployElementUseCase } from "@/screen/application/StandardPoint/usecase/ScreenStandardPointDeployElementUseCase";
import { execute as screenDisplayObjectInactvieElementService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectInactvieElementService";

/**
 * @description 選択されているDisplayObjectをクリア
 *              Clear the selected DisplayObject
 *
 * @param {WorkSpace} work_space
 * @param {MovieClip} movie_clip
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip
): Promise<void> => {

    // 選択されているDisplayObjectを非アクティブにする
    if (work_space.active && movie_clip.active) {
        for (const [index, depths] of movie_clip.selectedDepths) {
            const layer = movie_clip.getLayer(index);
            if (!layer) {
                continue;
            }
            screenDisplayObjectInactvieElementService(layer, depths);
        }
    }

    // 選択範囲のDisplayObjectを解放
    movie_clip.clearSelectedDepths();

    // アクティブなら表示を更新
    if (work_space.active && movie_clip.active) {
        // 選択範囲のElementを非表示
        targetRectHideElementService();

        // MovieClipの基準点の表示を更新
        screenStandardPointDeployElementUseCase();

        // プロパティエリアの表示を更新
        await propertyAreaChangeDisplayUseCase();
    }
};
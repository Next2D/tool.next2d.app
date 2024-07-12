import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as targetRectHideElementService } from "@/screen/application/TargetRect/service/TargetRectHideElementService";
import { execute as screenStandardPointDeployElementUseCase } from "@/screen/application/StandardPoint/usecase/ScreenStandardPointDeployElementUseCase";
import { execute as propertyAreaChangeDisplayUseCase } from "@/controller/application/PropertyArea/usecase/PropertyAreaChangeDisplayUseCase";

/**
 * @description 指定レイヤーのDisplayObjectの選択を解除
 *              Deselect the DisplayObject of the specified layer
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} layer_index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer_index: number
): void => {

    // 内部データから削除
    movie_clip.selectedDepths.delete(layer_index);

    // 表示がアクティブなら表示を更新
    if (work_space.active && movie_clip.active) {
        if (movie_clip.selectedDepths.size) {
            // 表示範囲を更新
            targetRectUpdateElementUseCase();

            // MovieClipの基準点の表示を更新
            screenStandardPointDeployElementUseCase();

            // プロパティエリアの表示を更新
            propertyAreaChangeDisplayUseCase();
        } else {
            // 選択範囲のelementを非表示に更新
            targetRectHideElementService();
        }
    }
};
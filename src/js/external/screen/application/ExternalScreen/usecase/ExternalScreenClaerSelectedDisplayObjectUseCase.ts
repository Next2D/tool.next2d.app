import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenAreaHideTargetRectElementService } from "@/screen/application/ScreenArea/service/ScreenAreaHideTargetRectElementService";

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
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip
): void => {

    // 選択範囲のDisplayObjectを解放
    movie_clip.clearSelectedDepths();

    // アクティブなら表示を更新
    if (work_space.active && movie_clip.active) {
        // 選択範囲のElementを非表示
        screenAreaHideTargetRectElementService();
    }
};
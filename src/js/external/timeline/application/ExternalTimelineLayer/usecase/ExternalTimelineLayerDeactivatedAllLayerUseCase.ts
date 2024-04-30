import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineLayerAllClearSelectedElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAllClearSelectedElementUseCase";
import { execute as screenAreaHideTargetRectElementService } from "@/screen/application/ScreenArea/service/ScreenAreaHideTargetRectElementService";

/**
 * @description 選択中の全てのレイヤーのアクティブを解除する
 *              Deactivate all selected layers
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_spcae: WorkSpace,
    movie_clip: MovieClip
): void => {

    // 表示中のMovieClipなら表示側を更新
    if (work_spcae.active && movie_clip.active) {
        // レイヤーで選択中のElementを初期化
        timelineLayerAllClearSelectedElementUseCase(movie_clip);

        // スクリーンの選択範囲 element を非表示に更新
        screenAreaHideTargetRectElementService();
    }

    // 内部データを初期化
    movie_clip.clearSelectedLayer();
};
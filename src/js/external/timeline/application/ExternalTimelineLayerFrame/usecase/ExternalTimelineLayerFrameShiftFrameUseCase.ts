import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $clamp } from "@/global/GlobalUtil";
import { $getScrollLimitX } from "@/timeline/application/TimelineUtil";
import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { execute as timelineScrollUpdateScrollXUseCase } from "@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollXUseCase";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as soundAreaRebuildSettingAreaUseCase } from "@/controller/application/SoundArea/usecase/SoundAreaRebuildSettingAreaUseCase";
import { execute as timelineLabelNameUpdateService } from "@/timeline/application/TimelineLabelName/service/TimelineLabelNameUpdateService";

/**
 * @description 指定フレームをタイムラインの一番左側にセットして表示を更新
 *              Set the specified frame to the far left of the timeline and update the display
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    frame: number
): Promise<void> => {

    // 表示側を更新
    if (work_space.active && movie_clip.active) {
        const delta = $clamp(
            (frame - 1) * (work_space.timelineAreaState.frameWidth + 1),
            0, $getScrollLimitX()
        );

        // リセット
        if (delta) {
            movie_clip.scrollX = 0;
            timelineScrollUpdateScrollXUseCase(delta);
        } else {
            timelineScrollUpdateScrollXUseCase(-movie_clip.scrollX);
        }

        // フレームを更新
        timelineFrameUpdateFrameElementService(frame);

        // マーカーを移動
        timelineMarkerMovePositionService();

        // サウンドエリアを再描画
        await soundAreaRebuildSettingAreaUseCase();

        // タイムラインのラベル表示を更新
        timelineLabelNameUpdateService(movie_clip.getLabel(frame));

        // スクリーンを再描画
        await screenAreaRedrawUseCase(movie_clip);
    }

    // 内部除法を更新
    movie_clip.currentFrame = frame;
};
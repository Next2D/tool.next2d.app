import { MovieClip } from "@/core/domain/model/MovieClip";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { execute as timelineLayerAllSelectedElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAllSelectedElementUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as soundAreaRebuildSettingAreaUseCase } from "@/controller/application/SoundArea/usecase/SoundAreaRebuildSettingAreaUseCase";

/**
 * @description 指定のフレームを選択状態に更新
 *              Update the specified frame to the selected state
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {array} frames
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    frames: number[]
): Promise<void> => {

    // 選択中のレイヤーがなければ終了
    if (!movie_clip.selectedLayers.length) {
        return ;
    }

    let frame = frames.length > 1
        ? movie_clip.selectedFrameObject.end
        : frames[0];

    if (!frame) {
        frame = frames[0];
    }

    if (work_space.active && movie_clip.active) {
        // フレームの表示を更新
        timelineFrameUpdateFrameElementService(frame);

        // マーカーを移動
        timelineMarkerMovePositionService();

        // 指定のフレームを選択状態に更新
        timelineLayerAllSelectedElementUseCase(movie_clip, frames);

        // サウンドエリアを再描画
        soundAreaRebuildSettingAreaUseCase();

        // スクリーンを再描画
        await screenAreaRedrawUseCase(movie_clip);
    }

    // 内部情報を更新
    movie_clip.currentFrame = frame;
};
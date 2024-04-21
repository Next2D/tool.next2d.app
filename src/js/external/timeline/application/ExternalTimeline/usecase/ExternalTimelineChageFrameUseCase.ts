import { MovieClip } from "@/core/domain/model/MovieClip";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $clamp } from "@/global/GlobalUtil";
import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as soundAreaRebuildSettingAreaUseCase } from "@/controller/application/SoundArea/usecase/SoundAreaRebuildSettingAreaUseCase";
import { execute as timelineLabelNameUpdateService } from "@/timeline/application/TimelineLabelName/service/TimelineLabelNameUpdateService";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";

/**
 * @description レイヤーのアクティブを初期化して指定のフレームを選択する
 *              Initialize the layer active and select the specified frame
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

    frame = $clamp(frame, 1, Number.MAX_VALUE);

    // 内部情報を更新
    movie_clip.currentFrame = frame;

    // アクティブなら表示を非アクティブに更新
    if (work_space.active && movie_clip.active) {
        // フレームの表示を更新
        timelineFrameUpdateFrameElementService(frame);

        // マーカーを移動
        timelineMarkerMovePositionService();

        // タイムラインを再生中でなければ更新
        if (timelineHeader.stopFlag) {
            // サウンドエリアの設定エリアを再構築
            soundAreaRebuildSettingAreaUseCase();

            // タイムラインのラベル表示を更新
            timelineLabelNameUpdateService(movie_clip.getLabel(frame));
        }

        // スクリーンエリアを再描画
        await screenAreaRedrawUseCase(movie_clip);
    }
};
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalTimelineLayerFrameInsertEmptyFramesUseCase } from "./ExternalTimelineLayerFrameInsertEmptyFramesUseCase";
import { execute as externalTimelineLayerFrameInsertKeyFramesUseCase } from "./ExternalTimelineLayerFrameInsertKeyFramesUseCase";
import { execute as externalTimelineLayerFramePrevAdjustmentUseCase } from "./ExternalTimelineLayerFramePrevAdjustmentUseCase";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as viewTimelineLayerFrameInsertFrameUseCase } from "@/view/timeline/TimelineLayerFrame/usecase/ViewTimelineLayerFrameUpdateFrameUseCase";

/**
 * @description 現在のフレームで、選択中のレイヤーに指定数のフレームを挿入
 *              Insert the specified number of frames into the selected layer at the current frame
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} num_frame
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    num_frame: number
): Promise<void> => {

    // レイヤーが何も選択されてなければ終了
    if (!movie_clip.selectedLayers.length) {
        return ;
    }

    let reload = false;
    const frame = movie_clip.currentFrame;
    const selectedLayers = movie_clip.getCloneAndSortSelectedLayers();
    for (let idx = 0; idx < selectedLayers.length; ++idx) {

        const layer = selectedLayers[idx];
        if (!layer) {
            continue;
        }

        const activeCharacters = layer.getActiveCharacters(frame);
        if (activeCharacters.length) {
            // キーフレームにフレームを挿入
            await externalTimelineLayerFrameInsertKeyFramesUseCase(
                work_space,
                movie_clip,
                layer,
                activeCharacters,
                num_frame
            );
            continue;
        }

        const activeEmptyCharacter = layer.getActiveEmptyCharacter(frame);
        if (activeEmptyCharacter) {
            // 空のキーフレームにフレームを挿入
            await externalTimelineLayerFrameInsertEmptyFramesUseCase(
                work_space,
                movie_clip,
                layer,
                activeEmptyCharacter,
                num_frame
            );
            continue;
        }

        // 追加するフレームにキーフレームがない場合は、前方のキーフレームを調整
        reload = await externalTimelineLayerFramePrevAdjustmentUseCase(
            work_space,
            movie_clip,
            layer,
            frame + 1
        );

        if (work_space.active && movie_clip.active) {
            // タイムラインのレイヤー表示を更新
            timelineLayerAddFrameUpdateLayerStyleUseCase(movie_clip, layer);
        }
    }

    // スクリーンを再描画
    if (reload) {
        await viewTimelineLayerFrameInsertFrameUseCase(work_space, movie_clip);
    }
};
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { execute as externalTimelineLayerFrameInsertEmptyFramesUseCase } from "./ExternalTimelineLayerFrameInsertEmptyFramesUseCase";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { execute as timelineScrollUpdateWidthService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateWidthService";
import { execute as externalTimelineLayerFramePrevAdjustmentUseCase } from "./ExternalTimelineLayerFramePrevAdjustmentUseCase";

/**
 * @description 現在のフレームで、選択中のレイヤーに指定数のフレームを挿入
 *              Insert the specified number of frames into the selected layer at the current frame
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} num_frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    num_frame: number
): void => {

    // レイヤーが何も選択されてなければ終了
    if (!movie_clip.selectedLayers.length) {
        return ;
    }

    const frame = movie_clip.currentFrame;
    const selectedLayers = movie_clip.getCloneAndSortSelectedLayers();
    for (let idx = 0; idx < selectedLayers.length; ++idx) {

        const layer = selectedLayers[idx];
        if (!layer) {
            continue;
        }

        const activeCharacters = layer.getActiveCharacters(frame);
        if (activeCharacters.length) {
            // TODO
            continue;
        }

        const activeEmptyCharacter = layer.getActiveEmptyCharacter(frame);
        if (activeEmptyCharacter) {
            // 空のキーフレームにフレームを挿入
            externalTimelineLayerFrameInsertEmptyFramesUseCase(
                work_space,
                movie_clip,
                layer,
                activeEmptyCharacter,
                num_frame
            );
            continue;
        }

        // 追加するフレームにキーフレームがない場合は、前方のキーフレームを調整
        externalTimelineLayerFramePrevAdjustmentUseCase(
            work_space,
            movie_clip,
            layer,
            frame + 1
        );

        if (work_space.active && movie_clip.active) {

            const layerElement = timelineLayer.elements[layer.getDisplayIndex()] as NonNullable<HTMLElement>;
            if (!layerElement) {
                return ;
            }

            // レイヤーのフレームスタイルを更新
            timelineLayerFrameUpdateStyleService(
                work_space, movie_clip,
                layerElement.lastElementChild as NonNullable<HTMLElement>,
                $getLeftFrame()
            );

            // タイムラインの幅を更新
            timelineScrollUpdateWidthService();
        }
    }
};
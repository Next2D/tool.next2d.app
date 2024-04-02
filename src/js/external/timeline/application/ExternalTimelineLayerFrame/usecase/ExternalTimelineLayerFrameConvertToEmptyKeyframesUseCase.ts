import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $convertFrameObject, $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { execute as externalTimelineLayerFramePrevAdjustmentUseCase } from "./ExternalTimelineLayerFramePrevAdjustmentUseCase";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { execute as externalTimelineLayerFrameCreateEmptyKeyframeUseCase } from "./ExternalTimelineLayerFrameCreateEmptyKeyframeUseCase";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 選択中のレイヤーに空のキーフレームを追加
 *              Add an empty keyframe to the selected layer
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} start_frame
 * @param  {number} end_frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    start_frame: number,
    end_frame: number = 0
): void =>
{
    // レイヤーが何も選択されてなければ終了
    if (!movie_clip.selectedLayers.length) {
        return ;
    }

    const frameObject = $convertFrameObject(start_frame, end_frame);

    // 移動分のフレームを取得
    const leftFrame: number = $getLeftFrame();

    // 昇順に並び替えたレイヤー配列を取得
    const selectedLayers = movie_clip.getCloneAndSortSelectedLayers();
    for (let idx = 0; idx < selectedLayers.length; ++idx) {

        const layer = selectedLayers[idx];
        if (!layer) {
            continue;
        }

        // 1フレーム目より未来のフレームにキーフレームを追加する場合は登録されてるフレームを調整
        if (frameObject.start > 1) {
            externalTimelineLayerFramePrevAdjustmentUseCase(
                work_space, movie_clip, layer, frameObject.start
            );
        }

        // 指定されたフレームに空のキーフレームを追加
        for (let frame = frameObject.start; frame < frameObject.end; ++frame) {

            externalTimelineLayerFrameCreateEmptyKeyframeUseCase(
                work_space,
                movie_clip,
                layer,
                frame,
                frame + 1
            );

        }

        // レイヤーを再描画
        if (work_space.active && movie_clip.active) {
            const layerElement = timelineLayer.elements[layer.getDisplayIndex()] as NonNullable<HTMLElement>;
            if (!layerElement) {
                continue;
            }

            // フレームのstyleを更新
            timelineLayerFrameUpdateStyleService(
                work_space, movie_clip,
                layerElement.lastElementChild as NonNullable<HTMLElement>,
                leftFrame
            );
        }
    }
};
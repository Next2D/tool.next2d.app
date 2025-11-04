import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $convertFrameObject } from "@/timeline/application/TimelineUtil";
import { execute as externalTimelineLayerFramePrevAdjustmentUseCase } from "./ExternalTimelineLayerFramePrevAdjustmentUseCase";
import { execute as externalTimelineLayerFrameSplitToEmptyUseCase } from "./ExternalTimelineLayerFrameSplitToEmptyUseCase";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as viewTimelineLayerFrameSplitEmptyKeyFrameUseCase } from "@/view/timeline/TimelineLayerFrame/usecase/ViewTimelineLayerFrameSplitEmptyKeyFrameUseCase";

/**
 * @description 選択中のレイヤーに空のキーフレームを追加
 *              Add an empty keyframe to the selected layer
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} start_frame
 * @param  {number} end_frame
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    start_frame: number,
    end_frame: number = 0
): Promise<void> => {

    // レイヤーが何も選択されてなければ終了
    if (!movie_clip.selectedLayers.length) {
        return ;
    }

    const frameObject = $convertFrameObject(start_frame, end_frame);

    // 再描画判定
    let reload = false;

    // 昇順に並び替えたレイヤー配列を取得
    const selectedLayers = movie_clip.getCloneAndSortSelectedLayers();
    const isActive = work_space.active && movie_clip.active;
    for (let idx = 0; idx < selectedLayers.length; ++idx) {

        const layer = selectedLayers[idx];
        if (!layer) {
            continue;
        }

        // 1フレーム目より未来のフレームにキーフレームを追加する場合は登録されてるフレームを調整
        if (frameObject.start > 1) {
            await externalTimelineLayerFramePrevAdjustmentUseCase(
                work_space, movie_clip, layer, frameObject.start
            );
        }

        // 指定されたフレームに空のキーフレームを追加
        for (let keyframe = frameObject.start; keyframe < frameObject.end; ++keyframe) {

            // 空のキーフレームに分割
            const result = await externalTimelineLayerFrameSplitToEmptyUseCase(
                work_space,
                movie_clip,
                layer,
                keyframe
            );

            if (result) {
                reload = true;
            }

        }

        // レイヤーを再描画
        if (!isActive) {
            continue;
        }

        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(movie_clip, layer);

        // 選択中のLayerを解除
        movie_clip.selectedDepths.delete(
            movie_clip.layers.indexOf(layer)
        );
    }

    // Viewエリアの表示を更新
    await viewTimelineLayerFrameSplitEmptyKeyFrameUseCase(
        work_space,
        movie_clip,
        reload
    );
};
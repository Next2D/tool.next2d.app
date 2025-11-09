import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalTimelineLayerFrameBehindKeyframeService } from "@/external/timeline/application/ExternalTimelineLayerFrame/service/ExternalTimelineLayerFrameBehindKeyframeService";
import { execute as viewTimelineLayerFrameUpdateFrameUseCase } from "@/view/timeline/TimelineLayerFrame/usecase/ViewTimelineLayerFrameUpdateFrameUseCase";

/**
 * @description 空のキーフレームのフレーム削除処理を元に戻す
 *              Undo the empty keyframe change process
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_index
 * @param  {number} keyframe
 * @param  {number} before_end_frame
 * @param  {number} after_end_frame
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    layer_index: number,
    keyframe: number,
    before_end_frame: number,
    after_end_frame: number
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip = workSpace.getLibrary(library_id) as MovieClip;
    if (!movieClip) {
        return ;
    }

    // レイヤーを抜き出し
    const layer = movieClip.getLayer(layer_index);
    if (!layer) {
        return ;
    }

    const emptyCharacter = layer.getActiveEmptyCharacter(keyframe);
    if (!emptyCharacter) {
        return ;
    }

    // 元に戻すフレーム分、後方に移動
    externalTimelineLayerFrameBehindKeyframeService(
        layer,
        emptyCharacter.endFrame,
        before_end_frame - after_end_frame
    );

    // 終了フレームを変更
    emptyCharacter.endFrame = before_end_frame;

    // Viewの更新
    await viewTimelineLayerFrameUpdateFrameUseCase(
        workSpace,
        movieClip,
        layer
    );
};
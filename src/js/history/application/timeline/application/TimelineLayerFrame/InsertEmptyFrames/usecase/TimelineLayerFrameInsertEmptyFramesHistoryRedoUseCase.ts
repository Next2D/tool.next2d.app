import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalTimelineLayerFrameBehindKeyframeService } from "@/external/timeline/application/ExternalTimelineLayerFrame/service/ExternalTimelineLayerFrameBehindKeyframeService";
import { execute as viewTimelineLayerFrameInsertFrameUseCase } from "@/view/timeline/TimelineLayerFrame/usecase/ViewTimelineLayerFrameUpdateFrameUseCase";

/**
 * @description 空のキーフレームへのフレーム追加処理を元に戻す
 *              Undo the process of adding a frame to an empty keyframe
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_index
 * @param  {number} keyframe
 * @param  {number} num_frame
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    layer_index: number,
    keyframe: number,
    num_frame: number
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

    // 後方にキーフレームを移動
    externalTimelineLayerFrameBehindKeyframeService(
        layer, emptyCharacter.endFrame, num_frame
    );

    // 空のキーフレームの終了フレームを更新
    emptyCharacter.endFrame += num_frame;

    await viewTimelineLayerFrameInsertFrameUseCase(
        workSpace,
        movieClip,
        layer
    );
};
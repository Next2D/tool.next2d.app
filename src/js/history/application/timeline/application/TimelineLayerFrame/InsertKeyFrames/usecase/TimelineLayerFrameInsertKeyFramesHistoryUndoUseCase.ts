import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalTimelineLayerFrameForwardKeyframeService } from "@/external/timeline/application/ExternalTimelineLayerFrame/service/ExternalTimelineLayerFrameForwardKeyframeService";
import { execute as viewTimelineLayerFrameInsertFrameUseCase } from "@/view/timeline/TimelineLayerFrame/usecase/ViewTimelineLayerFrameUpdateFrameUseCase";

/**
 * @description キーフレームへのフレーム追加処理を元に戻す
 *              Undo the process of adding a frame to a keyframe
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_index
 * @param  {number} start_frame
 * @param  {number} num_frame
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    layer_index: number,
    start_frame: number,
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

    const characters = layer.getActiveCharacters(start_frame);
    if (!characters.length) {
        return ;
    }

    // 前方にキーフレームを移動
    externalTimelineLayerFrameForwardKeyframeService(
        layer, characters[0].endFrame, num_frame
    );

    // キーフレームの終了フレームを更新
    for (let idx = 0; idx < characters.length; ++idx) {
        const character = characters[idx];
        if (!character) {
            continue;
        }
        character.endFrame -= num_frame;
    }

    // Viewの更新
    await viewTimelineLayerFrameInsertFrameUseCase(
        workSpace,
        movieClip,
        layer
    );
};
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as viewTimelineLayerFrameSplitEmptyKeyFrameUseCase } from "@/view/timeline/TimelineLayerFrame/usecase/ViewTimelineLayerFrameSplitEmptyKeyFrameUseCase";

/**
 * @description キーフレームの分割処理を元に戻す
 *              Undo keyframe splitting process
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_index
 * @param  {number} keyframe
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    layer_index: number,
    keyframe: number
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

    const activeCharacters = layer.getActiveCharacters(keyframe);
    if (!activeCharacters.length) {
        return ;
    }

    // 新規の空のキーフレームを追加
    // fixed logic
    const emptyCharacter = new EmptyCharacter();
    emptyCharacter.startFrame = keyframe;
    emptyCharacter.endFrame   = activeCharacters[0].endFrame;
    layer.addEmptyCharacter(emptyCharacter);

    // 既存のキーフレームの終了フレームを更新
    for (let idx = 0; idx < activeCharacters.length; ++idx) {
        const activeCharacter = activeCharacters[idx];
        if (!activeCharacter) {
            continue;
        }
        activeCharacter.endFrame = keyframe;
    }

    // アクティブならタイムラインを再描画
    if (!workSpace.active) {
        return ;
    }

    // タイムラインのレイヤー表示を更新
    if (movieClip.active) {
        timelineLayerAddFrameUpdateLayerStyleUseCase(movieClip, layer);
    }

    // Viewエリアの表示を更新
    await viewTimelineLayerFrameSplitEmptyKeyFrameUseCase(
        workSpace,
        movieClip
    );
};
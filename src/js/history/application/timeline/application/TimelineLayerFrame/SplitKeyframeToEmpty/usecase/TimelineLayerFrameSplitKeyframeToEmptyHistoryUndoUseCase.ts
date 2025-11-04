import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as viewTimelineLayerFrameSplitEmptyKeyFrameUseCase } from "@/view/timeline/TimelineLayerFrame/usecase/ViewTimelineLayerFrameSplitEmptyKeyFrameUseCase";

/**
 * @description キーフレームの分割処理を元に戻す
 *              Undo keyframe splitting process
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_index
 * @param  {number} empty_character_keyframe: number,
 * @param  {number} character_keyframe
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    layer_index: number,
    empty_character_keyframe: number,
    character_keyframe: number
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

    const emptyCharacter = layer.getActiveEmptyCharacter(empty_character_keyframe);
    if (!emptyCharacter) {
        return ;
    }

    const activeCharacters = layer.getActiveCharacters(character_keyframe);
    if (!activeCharacters.length) {
        return ;
    }

    // キーフレームの終了位置を更新
    for (let idx = 0; idx < activeCharacters.length; ++idx) {
        const activeCharacter = activeCharacters[idx];
        if (!activeCharacter) {
            continue;
        }
        activeCharacter.endFrame = emptyCharacter.endFrame;
    }

    // 空のキーフレームを削除
    layer.removeEmptyCharacter(emptyCharacter);

    // アクティブならタイムラインを再描画
    if (!workSpace.active) {
        return ;
    }

    if (movieClip.active) {
        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(movieClip, layer);

        // 選択中のLayerを解除
        movieClip.selectedDepths.delete(
            movieClip.layers.indexOf(layer)
        );
    }

    // Viewエリアの表示を更新
    await viewTimelineLayerFrameSplitEmptyKeyFrameUseCase(
        workSpace,
        movieClip
    );
};
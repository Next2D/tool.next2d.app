import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";

/**
 * @description 空のキーフレームの分割処理を元に戻す
 *              Undo empty keyframe splitting process
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_index
 * @param  {number} empty_character_index
 * @param  {number} new_empty_character_index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    layer_index: number,
    empty_character_index: number,
    new_empty_character_index: number,
    keyframe: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    // レイヤーを抜き出し
    const layer = movieClip.layers[layer_index];
    if (!layer) {
        return ;
    }

    const emptyCharacter = layer.emptyCharacters[empty_character_index];
    if (!emptyCharacter) {
        return ;
    }

    // 新規の空のキーフレームを追加
    // fixed logic
    const newEmptyCharacter = new EmptyCharacter();
    newEmptyCharacter.startFrame = keyframe;
    newEmptyCharacter.endFrame   = emptyCharacter.endFrame;
    layer.emptyCharacters.splice(new_empty_character_index, 0, newEmptyCharacter);

    // 既存の空のキーフレームの終了フレームを更新
    // fixed logic
    emptyCharacter.endFrame = keyframe;

    // アクティブならタイムラインを再描画
    if (workSpace.active && movieClip.active) {
        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(workSpace, movieClip, layer);
    }
};
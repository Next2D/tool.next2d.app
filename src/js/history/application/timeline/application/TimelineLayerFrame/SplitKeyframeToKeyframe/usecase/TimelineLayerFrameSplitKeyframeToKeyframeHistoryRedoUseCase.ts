import type { IInstance } from "@/interface/IInstance";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { Character } from "@/core/domain/model/Character";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";

/**
 * @description キーフレームの分割処理を元に戻す
 *              Undo keyframe splitting process
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_index
 * @param  {number} keyframe
 * @param  {number} character_keyframe
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    layer_index: number,
    keyframe: number,
    character_keyframe: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: IInstance<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    // レイヤーを抜き出し
    const layer = movieClip.getLayer(layer_index);
    if (!layer) {
        return ;
    }

    const activeCharacters = layer.getActiveCharacters(character_keyframe);
    if (!activeCharacters.length) {
        return ;
    }

    for (let idx = 0; idx < activeCharacters.length; ++idx) {
        const activeCharacter = activeCharacters[idx];
        if (!activeCharacter) {
            continue;
        }

        const newCharacter = new Character();
        layer.addCharacter(newCharacter);
        newCharacter.load(activeCharacter.toObject());

        newCharacter.startFrame = keyframe;
        newCharacter.endFrame   = activeCharacter.endFrame;

        activeCharacter.endFrame = keyframe;
    }

    // アクティブならタイムラインを再描画
    if (workSpace.active && movieClip.active) {
        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(movieClip, layer);
    }
};
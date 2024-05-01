import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { CharacterSaveObjectImpl } from "@/interface/CharacterSaveObjectImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as screenAreaRemoveDisplayObjectElementService } from "@/screen/application/ScreenArea/service/ScreenAreaRemoveDisplayObjectElementService";
import { execute as screenAreaMoveTargetRectElementUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaMoveTargetRectElementUseCase";

/**
 * @description キーフレーム追加処理を元に戻す
 *              Undo the process of adding a keyframe
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_ndex
 * @param  {object} character_save_object
 * @param  {number} empty_character_index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    layer_ndex: number,
    character_save_object: CharacterSaveObjectImpl,
    empty_character_index: number
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
    const layer = movieClip.getLayer(layer_ndex);
    if (!layer) {
        return ;
    }

    const character = layer.getCharacter(
        character_save_object.startFrame,
        character_save_object.depth
    );
    if (!character) {
        return ;
    }

    // 空のキーフレームに上書きした場合は、空のキーフレームを追加
    if (empty_character_index > -1) {
        const emptyCharacter = new EmptyCharacter();
        emptyCharacter.startFrame = character.startFrame;
        emptyCharacter.endFrame   = character.endFrame;
        layer.addEmptyCharacter(emptyCharacter);
    }

    // アクティブならタイムラインを再描画
    // fixed logic
    if (workSpace.active && movieClip.active) {
        // スクリーンに追加したElementを削除
        screenAreaRemoveDisplayObjectElementService(layer.id, character.depth);
    }

    // 追加したDisplahyObjectを削除
    // fixed logic
    layer.removeCharacter(character);

    // 選択状態を解除
    movieClip.clearSelectedDepths();

    // アクティブならタイムラインを再描画
    // fixed logic
    if (workSpace.active && movieClip.active) {
        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(workSpace, movieClip, layer);

        // 選択範囲のElementの表示を更新
        screenAreaMoveTargetRectElementUseCase(movieClip);
    }
};
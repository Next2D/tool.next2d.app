import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { CharacterSaveObjectImpl } from "@/interface/CharacterSaveObjectImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { Character } from "@/core/domain/model/Character";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as screenAreaAppendCharacterService } from "@/screen/application/ScreenArea/service/ScreenAreaAppendCharacterService";
import { execute as screenAreaMoveTargetRectElementUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaMoveTargetRectElementUseCase";

/**
 * @description キーフレーム追加処理を元に戻す
 *              Undo the process of adding a keyframe
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_index
 * @param  {object} save_object
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    layer_index: number,
    save_object: CharacterSaveObjectImpl
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    // レイヤーを抜き出し
    const layer = movieClip.getLayer(layer_index);
    if (!layer) {
        return ;
    }

    // セーブデータからDisplayObjectを生成
    const character = new Character();
    character.load(save_object);
    layer.addCharacter(character);

    // 空のキーフレームがあれば削除
    const emptyCharacter = layer.getActiveEmptyCharacter(character.startFrame);
    if (emptyCharacter) {
        layer.removeEmptyCharacter(emptyCharacter);
    }

    // 選択状態を解除
    movieClip.clearSelectedDepths();

    // アクティブならタイムラインを再描画
    if (workSpace.active && movieClip.active) {
        // タイムラインにフレームを追加
        timelineLayerAddFrameUpdateLayerStyleUseCase(workSpace, movieClip, layer);

        // 選択範囲のElementの表示を更新
        screenAreaMoveTargetRectElementUseCase(movieClip);

        // スクリーンエリアにElementを追加
        await screenAreaAppendCharacterService(character, layer);
    }
};
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { CharacterSaveObjectImpl } from "@/interface/CharacterSaveObjectImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { execute as timelineScrollUpdateWidthService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateWidthService";
import { Character } from "@/core/domain/model/Character";

/**
 * @description キーフレーム追加処理を元に戻す
 *              Undo the process of adding a keyframe
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_index
 * @param  {number} character_index
 * @param  {object} save_object
 * @param  {number} empty_character_index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    layer_index: number,
    character_index: number,
    save_object: CharacterSaveObjectImpl,
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
    const layer = movieClip.layers[layer_index];
    if (!layer) {
        return ;
    }

    // セーブデータからDisplayObjectを生成
    const character = new Character();
    character.load(save_object);
    layer.characters.splice(character_index, 0, character);

    // 空のキーフレームがあれば削除
    if (empty_character_index > -1) {
        layer.emptyCharacters.splice(empty_character_index, 1);
    }

    // アクティブならタイムラインを再描画
    if (workSpace.active && movieClip.active) {
        const layerElement = timelineLayer.elements[layer.getDisplayIndex()] as NonNullable<HTMLElement>;
        if (!layerElement) {
            return ;
        }

        // レイヤーのフレームスタイルを更新
        timelineLayerFrameUpdateStyleService(
            workSpace, movieClip,
            layerElement.lastElementChild as NonNullable<HTMLElement>,
            $getLeftFrame()
        );

        // タイムラインの幅を更新
        timelineScrollUpdateWidthService();

        // スクリーンエリアにElementを追加
    }
};
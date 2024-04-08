import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { execute as timelineScrollUpdateWidthService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateWidthService";
import { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";

/**
 * @description キーフレーム追加処理を元に戻す
 *              Undo the process of adding a keyframe
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_ndex
 * @param  {number} character_index
 * @param  {number} empty_character_index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    layer_ndex: number,
    character_index: number,
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
    const layer = movieClip.layers[layer_ndex];
    if (!layer) {
        return ;
    }

    const character = layer.characters[character_index];
    if (!character) {
        return ;
    }

    // 空のキーフレームに上書きした場合は、空のキーフレームを追加
    if (empty_character_index === -1) {
        const emptyCharacter = new EmptyCharacter();
        emptyCharacter.startFrame = character.startFrame;
        emptyCharacter.endFrame   = character.endFrame;
        layer.emptyCharacters.splice(empty_character_index, 0, emptyCharacter);
    }

    // 追加したDisplahyObjectを削除
    layer.removeCharacter(character);

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

        // TODO スクリーンに追加したElementを削除
    }
};
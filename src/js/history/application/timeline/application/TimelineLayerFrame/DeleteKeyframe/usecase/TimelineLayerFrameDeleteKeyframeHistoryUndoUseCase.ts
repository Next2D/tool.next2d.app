import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { CharacterSaveObjectImpl } from "@/interface/CharacterSaveObjectImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as externalTimelineLayerFrameExtendBehindKeyframeService } from "@/external/timeline/application/ExternalTimelineLayerFrame/service/ExternalTimelineLayerFrameExtendBehindKeyframeService";
import { execute as externalTimelineLayerFrameExtendForwardKeyframeService } from "@/external/timeline/application/ExternalTimelineLayerFrame/service/ExternalTimelineLayerFrameExtendForwardKeyframeService";
import { Character } from "@/core/domain/model/Character";

/**
 * @description キーフレームの削除処理を元に戻す
 *              Undo the keyframe deletion process
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_index
 * @param  {object} character_save_objects
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    layer_index: number,
    character_save_objects: CharacterSaveObjectImpl[]
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

    // キーフレームをセット
    const startFrame = character_save_objects[0].startFrame;
    const endFrame   = character_save_objects[0].endFrame;

    // キーフレームのフレーム数
    const numFrames = endFrame - startFrame;

    if (startFrame > 1) {
        // 前方のフレームを後方に延長
        externalTimelineLayerFrameExtendBehindKeyframeService(
            layer, startFrame - 1, -numFrames
        );
    } else {
        // 後方のフレームを前方に延長
        externalTimelineLayerFrameExtendForwardKeyframeService(
            layer, endFrame, -numFrames
        );
    }

    // セーブオブジェクトからDisplayObjectを復元
    for (let idx = 0; idx < character_save_objects.length; ++idx) {
        const characterSaveObject = character_save_objects[idx];
        if (!characterSaveObject) {
            continue;
        }

        const character = new Character();
        character.load(characterSaveObject);

        // レイヤーに登録
        layer.addCharacter(character);
    }

    // アクティブならタイムラインを再描画
    if (workSpace.active && movieClip.active) {
        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(workSpace, movieClip, layer);
    }
};
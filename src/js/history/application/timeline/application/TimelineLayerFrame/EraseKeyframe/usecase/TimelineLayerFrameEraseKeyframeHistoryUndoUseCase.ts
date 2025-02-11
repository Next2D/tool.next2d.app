import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { ICharacterSaveObject } from "@/interface/ICharacterSaveObject";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { Character } from "@/core/domain/model/Character";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as externalTimelineLayerFrameBehindKeyframeService } from "@/external/timeline/application/ExternalTimelineLayerFrame/service/ExternalTimelineLayerFrameBehindKeyframeService";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

/**
 * @description キーフレームのフレーム全削除処理を元に戻す
 *              Undo the keyframe frame deletion process
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_index
 * @param  {object} character_save_objects
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    layer_index: number,
    character_save_objects: ICharacterSaveObject[]
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

    // キーフレームをセット
    const startFrame = character_save_objects[0].startFrame;
    const endFrame   = character_save_objects[0].endFrame;

    // 追加する範囲のキーフレームを後方に移動
    externalTimelineLayerFrameBehindKeyframeService(
        layer,
        startFrame,
        endFrame - startFrame
    );

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
        timelineLayerAddFrameUpdateLayerStyleUseCase(movieClip, layer);

        // スクリーンエリアを再描画
        await screenAreaRedrawUseCase(movieClip);
    }
};
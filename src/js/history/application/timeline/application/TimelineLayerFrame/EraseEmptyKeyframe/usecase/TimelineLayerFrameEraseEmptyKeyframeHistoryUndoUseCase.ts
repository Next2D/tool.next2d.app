import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { EmptyCharacterSaveObjectImpl } from "@/interface/EmptyCharacterSaveObjectImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as externalTimelineLayerFrameBehindKeyframeService } from "@/external/timeline/application/ExternalTimelineLayerFrame/service/ExternalTimelineLayerFrameBehindKeyframeService";
import { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

/**
 * @description 空のキーフレームのフレーム全削除処理を元に戻す
 *              Undo the process of completely deleting the frame of the empty keyframe
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_index
 * @param  {object} empty_character_save_object
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    layer_index: number,
    empty_character_save_object: EmptyCharacterSaveObjectImpl
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

    // 空のキーフレームを復元
    const emptyCharacter = new EmptyCharacter();
    emptyCharacter.load(empty_character_save_object);

    // 追加する範囲のキーフレームを後方に移動
    externalTimelineLayerFrameBehindKeyframeService(
        layer,
        emptyCharacter.startFrame,
        emptyCharacter.endFrame - emptyCharacter.startFrame
    );

    // 削除した空のキーフレームを元に戻す
    layer.addEmptyCharacter(emptyCharacter);

    // アクティブならタイムラインを再描画
    if (workSpace.active && movieClip.active) {
        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(movieClip, layer);

        // スクリーンエリアの再描画
        await screenAreaRedrawUseCase(movieClip);
    }
};
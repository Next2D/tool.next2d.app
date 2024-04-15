import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { CharacterSaveObjectImpl } from "@/interface/CharacterSaveObjectImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { Character } from "@/core/domain/model/Character";
import { execute as timelineLayerFrameAddKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/AddKeyframe/usecase/TimelineLayerFrameAddKeyframeHistoryUseCase";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";

/**
 * @description キーフレーム追加を実行
 *              Execute adding a keyframe
 *
 * @param  {object} message
 * @return {void}
 * @method
 * @public
 */
export const execute = (message: ShareReceiveMessageImpl): void =>
{
    const id = message.data[0] as NonNullable<number>;

    const workSpace = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    const libraryId = message.data[1] as NonNullable<number>;
    const movieClip: InstanceImpl<MovieClip> = workSpace.getLibrary(libraryId);
    if (!movieClip) {
        return ;
    }

    const layer_index = message.data[2] as NonNullable<number>;
    const layer = movieClip.getLayer(layer_index);
    if (!layer) {
        return ;
    }

    const character_save_object = message.data[3] as NonNullable<CharacterSaveObjectImpl>;
    const character = new Character();
    character.load(character_save_object);

    // 追加処理
    // fixed logic
    layer.addCharacter(character);

    const emptyCharacter = layer.getActiveEmptyCharacter(character.startFrame);
    if (emptyCharacter) {
        layer.removeEmptyCharacter(emptyCharacter);
    }

    // 履歴に登録
    timelineLayerFrameAddKeyframeHistoryUseCase(
        workSpace, movieClip,
        layer, character,
        message.data[4] as NonNullable<number>,
        true
    );

    if (workSpace.active && movieClip.active) {
        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(workSpace, movieClip, layer);
    }
};
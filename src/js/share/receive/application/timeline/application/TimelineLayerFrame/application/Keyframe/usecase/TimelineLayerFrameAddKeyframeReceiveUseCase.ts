import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { ICharacterSaveObject } from "@/interface/ICharacterSaveObject";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { Character } from "@/core/domain/model/Character";
import { execute as timelineLayerFrameAddKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/AddKeyframe/usecase/TimelineLayerFrameAddKeyframeHistoryUseCase";
import { execute as viewTimelineLayerFrameAddKeyFrameUseCase } from "@/view/timeline/TimelineLayerFrame/usecase/ViewTimelineLayerFrameAddKeyFrameUseCase";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";

/**
 * @description キーフレーム追加を実行
 *              Execute adding a keyframe
 *
 * @param  {object} message
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (message: IShareReceiveMessage): Promise<void> =>
{
    const id = message.data[0] as NonNullable<number>;

    const workSpace = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    const libraryId = message.data[1] as NonNullable<number>;
    const movieClip = workSpace.getLibrary(libraryId) as MovieClip;
    if (!movieClip) {
        return ;
    }

    const layer_index = message.data[2] as NonNullable<number>;
    const layer = movieClip.getLayer(layer_index);
    if (!layer) {
        return ;
    }

    const character_save_object = message.data[3] as NonNullable<ICharacterSaveObject>;
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
    await timelineLayerFrameAddKeyframeHistoryUseCase(
        workSpace, movieClip,
        layer, character,
        message.data[4] as NonNullable<number>,
        true
    );
    
    // 全ての先祖のキャッシュを削除
    cacheRemoveService(workSpace, movieClip.id);

    // View側の処理
    await viewTimelineLayerFrameAddKeyFrameUseCase(
        workSpace,
        movieClip,
        layer,
        character
    );
};
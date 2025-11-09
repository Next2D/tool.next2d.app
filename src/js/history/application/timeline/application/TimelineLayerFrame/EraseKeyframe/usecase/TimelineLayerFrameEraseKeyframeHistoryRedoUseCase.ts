import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { ICharacterSaveObject } from "@/interface/ICharacterSaveObject";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalTimelineLayerFrameForwardKeyframeService } from "@/external/timeline/application/ExternalTimelineLayerFrame/service/ExternalTimelineLayerFrameForwardKeyframeService";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";
import { execute as viewTimelineLayerFrameUpdateFrameUseCase } from "@/view/timeline/TimelineLayerFrame/usecase/ViewTimelineLayerFrameUpdateFrameUseCase";

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

    const activeCharacters = layer.getActiveCharacters(startFrame);
    if (!activeCharacters.length) {
        return ;
    }

    for (let idx = 0; idx < activeCharacters.length; ++idx) {
        const character = activeCharacters[idx];
        if (!character) {
            continue;
        }

        // キャラクターを削除
        layer.removeCharacter(character);
    }

    // 削除するフレーム分、前方に移動
    externalTimelineLayerFrameForwardKeyframeService(
        layer,
        endFrame,
        endFrame - startFrame
    );

    // キャッシュを削除
    cacheRemoveService(workSpace, movieClip.id);

    // Viewを更新
    await viewTimelineLayerFrameUpdateFrameUseCase(
        workSpace,
        movieClip,
        layer
    );
};
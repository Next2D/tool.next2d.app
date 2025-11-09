import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { ICharacterSaveObject } from "@/interface/ICharacterSaveObject";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as externalTimelineLayerFrameExtendBehindKeyframeService } from "@/external/timeline/application/ExternalTimelineLayerFrame/service/ExternalTimelineLayerFrameExtendBehindKeyframeService";
import { execute as externalTimelineLayerFrameExtendForwardKeyframeService } from "@/external/timeline/application/ExternalTimelineLayerFrame/service/ExternalTimelineLayerFrameExtendForwardKeyframeService";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";
import { execute as viewTimelineLayerFrameDeleteKeyFrameUseCase } from "@/view/timeline/TimelineLayerFrame/usecase/ViewTimelineLayerFrameDeleteKeyFrameUseCase";

/**
 * @description 空のキーフレームの削除処理を元に戻す
 *              Undo the process of deleting empty keyframes
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_index
 * @param  {array} character_save_objects
 * @return {void}
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

    // キーフレームのフレーム数
    const numFrames = endFrame - startFrame;

    if (startFrame > 1) {
        // 前方のフレームを後方に延長
        externalTimelineLayerFrameExtendBehindKeyframeService(
            layer, startFrame - 1, numFrames
        );
    } else {
        // 後方のフレームを前方に延長
        externalTimelineLayerFrameExtendForwardKeyframeService(
            layer, endFrame, numFrames
        );
    }

    for (let idx = 0; idx < activeCharacters.length; ++idx) {
        const character = activeCharacters[idx];
        if (!character) {
            continue;
        }

        // キャラクターを削除
        layer.removeCharacter(character);
    }

    // 全ての先祖のキャッシュを削除
    cacheRemoveService(workSpace, movieClip.id);

    // プロジェクトがアクティブでなければ終了
    if (!workSpace.active) {
        return ;
    }

    // アクティブならタイムラインを再描画
    if (movieClip.active) {
        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(movieClip, layer);
    }

    // Viewを更新
    await viewTimelineLayerFrameDeleteKeyFrameUseCase(
        workSpace,
        movieClip
    );
};
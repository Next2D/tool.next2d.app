import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerFrameUpdateKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/UpdateKeyframe/usecase/TimelineLayerFrameUpdateKeyframeHistoryUseCase";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

/**
 * @description キーフレーム更新を実行
 *              Perform keyframe update
 *
 * @param  {object} message
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (message: ShareReceiveMessageImpl): Promise<void> =>
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

    const layerIndex = message.data[2] as NonNullable<number>;
    const layer = movieClip.getLayer(layerIndex);
    if (!layer) {
        return ;
    }

    const keyframe = message.data[3] as NonNullable<number>;
    const activeCharacters = layer.getActiveCharacters(keyframe);
    if (!activeCharacters.length) {
        return ;
    }

    // 終了フレームを更新
    const afterEndFrame = message.data[5] as NonNullable<number>;
    for (let idx = 0; idx < activeCharacters.length; idx++) {
        const character = activeCharacters[idx];
        character.endFrame = afterEndFrame;
    }

    // 履歴に登録
    timelineLayerFrameUpdateKeyframeHistoryUseCase(
        workSpace,
        movieClip,
        layer,
        keyframe,
        message.data[4] as NonNullable<number>, // beforeEndFrame
        afterEndFrame,
        true
    );

    if (workSpace.active && movieClip.active) {
        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(workSpace, movieClip, layer);

        // スクリーンエリア再描画
        await screenAreaRedrawUseCase(movieClip);
    }
};
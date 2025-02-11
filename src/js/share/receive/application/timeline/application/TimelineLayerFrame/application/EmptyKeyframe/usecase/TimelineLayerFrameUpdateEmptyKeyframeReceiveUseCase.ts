import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerFrameUpdateEmptyKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/UpdateEmptyKeyframe/usecase/TimelineLayerFrameUpdateEmptyKeyframeHistoryUseCase";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

/**
 * @description 空のキーフレーム更新を実行
 *              Perform empty keyframe update
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

    const layerIndex = message.data[2] as NonNullable<number>;
    const layer = movieClip.getLayer(layerIndex);
    if (!layer) {
        return ;
    }

    const keyframe = message.data[3] as NonNullable<number>;
    const emptyCharacter = layer.getActiveEmptyCharacter(keyframe);
    if (!emptyCharacter) {
        return ;
    }

    // 終了フレームを更新
    const beforeEndFrame = message.data[4] as NonNullable<number>; // beforeEndFrame
    emptyCharacter.endFrame = message.data[5] as NonNullable<number>; // afterEndFrame

    // 履歴に登録
    timelineLayerFrameUpdateEmptyKeyframeHistoryUseCase(
        workSpace,
        movieClip,
        layer,
        emptyCharacter,
        beforeEndFrame,
        true
    );

    if (workSpace.active && movieClip.active) {
        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(movieClip, layer);

        // スクリーンエリアを再描画
        await screenAreaRedrawUseCase(movieClip);
    }
};
import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { ICharacterSaveObject } from "@/interface/ICharacterSaveObject";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as externalTimelineLayerFrameDeleteKeyframeUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameDeleteKeyframeUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

/**
 * @description キーフレームの削除を実行
 *              Perform the deletion of keyframes
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

    const characterSaveObjects = message.data[3] as NonNullable<ICharacterSaveObject[]>;
    if (!characterSaveObjects.length) {
        return ;
    }

    const keyframe = characterSaveObjects[0].startFrame;
    const activeCharacters = layer.getActiveCharacters(keyframe);
    if (!activeCharacters.length) {
        return ;
    }

    // キーフレームを削除
    externalTimelineLayerFrameDeleteKeyframeUseCase(
        workSpace,
        movieClip,
        layer,
        activeCharacters,
        true
    );

    if (workSpace.active && movieClip.active) {
        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(movieClip, layer);

        // スクリーンエリアを再描画
        await screenAreaRedrawUseCase(movieClip);
    }
};
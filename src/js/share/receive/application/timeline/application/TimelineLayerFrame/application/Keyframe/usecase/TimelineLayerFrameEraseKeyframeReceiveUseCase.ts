import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { ICharacterSaveObject } from "@/interface/ICharacterSaveObject";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as externalTimelineLayerFrameEraseKeyframeUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameEraseKeyframeUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as viewTimelineLayerFrameEraseKeyFrameUseCase } from "@/view/application/usecase/ViewTimelineLayerFrameEraseKeyFrameUseCase";

/**
 * @description キーフレームのフレーム全削除を実行
 *              Execute all frame deletion of keyframes
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

    // キーフレームのフレームを全て削除
    await externalTimelineLayerFrameEraseKeyframeUseCase(
        workSpace,
        movieClip,
        layer,
        activeCharacters,
        true
    );

    // Viewの更新
    await viewTimelineLayerFrameEraseKeyFrameUseCase(
        workSpace,
        movieClip,
        layer
    );
};
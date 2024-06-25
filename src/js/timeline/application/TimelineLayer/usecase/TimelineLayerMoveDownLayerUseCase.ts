import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineScrollUpdateScrollYUseCase } from "@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollYUseCase";
import { $getTopIndex } from "../../TimelineUtil";

/**
 * @description タイムラインの指定レイヤーを1つ下へ移動
 *              Move the specified layer in the timeline down one
 *
 * @param  {KeyboardEvent} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: KeyboardEvent): Promise<void> =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const length = movieClip.selectedLayers.length;
    if (!length) {
        return ;
    }

    const layer = movieClip.selectedLayers[length - 1];
    if (!layer) {
        return ;
    }

    const externalLayer = new ExternalLayer(
        workSpace,
        movieClip,
        layer
    );

    const index = externalLayer.index + 1;
    if (movieClip.layers.length <= index) {
        return ;
    }

    // タイムラインをスクロール
    if (index >= $getTopIndex() + timelineLayer.numberOfDisplays) {
        const frameHeight = workSpace.timelineAreaState.frameHeight + 1;
        timelineScrollUpdateScrollYUseCase(
            frameHeight
        );
    }

    const externalTimeline = new ExternalTimeline(
        workSpace,
        movieClip
    );

    // レイヤーを選択
    externalTimeline.selectedLayers([index]);

    // フレームを選択
    await externalTimeline.selectedFrames([movieClip.currentFrame]);
};
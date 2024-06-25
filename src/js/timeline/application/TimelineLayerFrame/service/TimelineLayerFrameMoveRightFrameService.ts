import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { $getMaxFrame, $getRightFrame } from "../../TimelineUtil";

/**
 * @description タイムラインの指定レイヤーの1フレーム右へ移動
 *              Move to the right frame of the specified layer in the timeline
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

    const nextFrame = movieClip.currentFrame + 1;
    if (nextFrame > $getMaxFrame()) {
        return ;
    }

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

    const externalTimeline = new ExternalTimeline(
        workSpace,
        movieClip
    );

    externalTimeline
        .selectedLayers([externalLayer.index]);

    const rightFrame = $getRightFrame();
    if (nextFrame >= rightFrame) {
        await externalTimeline.shiftFrame(nextFrame);
    } else {
        await externalTimeline.selectedFrames([nextFrame]);
    }
};
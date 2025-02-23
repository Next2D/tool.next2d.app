import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { $getLeftFrame } from "../../TimelineUtil";

/**
 * @description タイムラインの指定レイヤーの1フレーム左へ移動
 *              Move to the left frame of the specified layer in the timeline
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

    if (movieClip.currentFrame === 1) {
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

    await externalTimeline
        .selectedLayers([externalLayer.index]);

    const prevFrame = movieClip.currentFrame - 1;
    const leftFrame = $getLeftFrame();
    if (leftFrame > prevFrame) {
        await externalTimeline.shiftFrame(prevFrame);
    } else {
        await externalTimeline.selectedFrames([prevFrame]);
    }
};
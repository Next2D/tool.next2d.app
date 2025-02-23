import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { $getRightFrame } from "@/timeline/application/TimelineUtil";

/**
 * @description タイムラインの指定レイヤーの次のキーフレームへ移動
 *              Move to the next key frame of the specified layer in the timeline
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
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

    const maxFrame = layer.maxFrame - 1;
    const frame = movieClip.currentFrame;
    const activeCharacters = layer.getActiveCharacters(frame);

    let nextFrame = frame;
    if (activeCharacters.length) {
        const activeCharacter = activeCharacters[0];
        nextFrame = Math.min(maxFrame, activeCharacter.endFrame);
    } else {
        const emptyCharacter = layer.getActiveEmptyCharacter(frame);
        if (emptyCharacter) {
            nextFrame = Math.min(maxFrame, emptyCharacter.endFrame);
        }
    }

    // 最後に選択したレイヤーを選択
    const externalLayer = new ExternalLayer(
        workSpace, movieClip, layer
    );

    const externalTimeline = new ExternalTimeline(
        workSpace, workSpace.scene
    );

    await externalTimeline.selectedLayers([externalLayer.index]);

    const rightFrame = $getRightFrame();
    if (nextFrame >= rightFrame) {
        await externalTimeline.shiftFrame(nextFrame);
    } else {
        await externalTimeline.selectedFrames([nextFrame]);
    }
};
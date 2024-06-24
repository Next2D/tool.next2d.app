import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

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

    const externalTimeline = new ExternalTimeline(
        workSpace, workSpace.scene
    );
    await externalTimeline
        .shiftFrame(nextFrame);
};
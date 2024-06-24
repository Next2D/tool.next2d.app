import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description タイムラインの指定レイヤーの前のキーフレームへ移動
 *              Move to the previous key frame of the specified layer in the timeline
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

    const frame = movieClip.currentFrame - 1;
    if (1 > frame) {
        return ;
    }

    const layer = movieClip.selectedLayers[length - 1];
    const activeCharacters = layer.getActiveCharacters(frame);

    let prevFrame = layer.maxFrame - 1;
    if (activeCharacters.length) {
        const activeCharacter = activeCharacters[0];
        prevFrame = activeCharacter.startFrame;
    } else {
        const emptyCharacter = layer.getActiveEmptyCharacter(frame);
        if (emptyCharacter) {
            prevFrame = emptyCharacter.startFrame;
        }
    }

    const externalTimeline = new ExternalTimeline(
        workSpace, workSpace.scene
    );
    await externalTimeline
        .shiftFrame(prevFrame);
};
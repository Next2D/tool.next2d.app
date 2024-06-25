import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";

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
    if (!layer) {
        return ;
    }

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

    // 最後に選択したレイヤーを選択
    const externalLayer = new ExternalLayer(
        workSpace, movieClip, layer
    );

    const externalTimeline = new ExternalTimeline(
        workSpace, workSpace.scene
    );

    externalTimeline.selectedLayers([externalLayer.index]);

    const leftFrame = $getLeftFrame();
    if (leftFrame > prevFrame) {
        await externalTimeline.shiftFrame(prevFrame);
    } else {
        await externalTimeline.selectedFrames([prevFrame]);
    }
};
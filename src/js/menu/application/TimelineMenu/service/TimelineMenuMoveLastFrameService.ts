import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description タイムラインメニューの指定レイヤーの最終フレームへ移動
 *              Move to the last frame of the specified layer in the timeline menu
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

    const externalTimeline = new ExternalTimeline(
        workSpace, workSpace.scene
    );
    await externalTimeline
        .shiftFrame(layer.maxFrame - 1);
};
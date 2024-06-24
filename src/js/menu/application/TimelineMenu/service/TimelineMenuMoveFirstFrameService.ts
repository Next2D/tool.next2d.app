import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description タイムラインメニューの指定レイヤーの1フレームへ移動
 *              Move to the first frame of the specified layer in the timeline menu
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    if (!movieClip.selectedLayers.length) {
        return ;
    }

    const externalTimeline = new ExternalTimeline(
        workSpace, workSpace.scene
    );
    await externalTimeline.shiftFrame(1);
};
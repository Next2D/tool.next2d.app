import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";

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

    const length = movieClip.selectedLayers.length;
    if (!length) {
        return ;
    }

    const layer = movieClip.selectedLayers[length - 1];
    if (!layer) {
        return ;
    }

    const externalLayer = new ExternalLayer(
        workSpace, movieClip, layer
    );

    const externalTimeline = new ExternalTimeline(
        workSpace, workSpace.scene
    );

    // 最後に選択したレイヤーを選択
    await externalTimeline.selectedLayers([externalLayer.index]);

    const leftFrame = $getLeftFrame();
    if (leftFrame === 1) {
        await externalTimeline.selectedFrames([1]);
    } else {
        // 1フレームへ画面を移動
        await externalTimeline.shiftFrame(1);
    }
};
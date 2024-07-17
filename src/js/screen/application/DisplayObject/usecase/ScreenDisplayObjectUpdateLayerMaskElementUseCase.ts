import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { Layer } from "@/core/domain/model/Layer";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { execute as screenDisplayObjectUpdateLayerMaskInElementUseCase } from "./ScreenDisplayObjectUpdateLayerMaskInElementUseCase";
import { $MASK_IN_MODE, $MASK_MODE } from "@/config/LayerModeConfig";

/**
 * @description 親のレイヤーの配下にある子レイヤーDisplayObjectのElemnet表示を更新する
 *              Update the Elemnet display of the child layer DisplayObject under the parent layer
 *
 * @param {Layer} parent_layer
 * @returns {Promise}
 * @method
 * @public
 */
export const execute = async (parent_layer: Layer): Promise<void> =>
{
    if (parent_layer.mode !== $MASK_MODE) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const externalLayer = new ExternalLayer(
        workSpace,
        movieClip,
        parent_layer
    );

    const index = externalLayer.index;
    for (let idx = index + 1; movieClip.layers.length > idx; ++idx) {
        const layer = movieClip.layers[idx];
        if (!layer) {
            continue;
        }

        if (layer.mode !== $MASK_IN_MODE) {
            break;
        }

        // マスクインのレイヤーのDisplayObjectのElemnet表示を更新
        await screenDisplayObjectUpdateLayerMaskInElementUseCase(
            movieClip, layer
        );
    }
};
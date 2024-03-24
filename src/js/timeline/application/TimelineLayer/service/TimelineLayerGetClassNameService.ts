import { $GUIDE_IN_MODE, $GUIDE_MODE, $MASK_IN_MODE, $MASK_MODE } from "@/config/LayerModeConfig";
import type { LayerModeImpl } from "@/interface/LayerModeImpl";

/**
 * @description レイヤーのモードに応じたクラス名を返却
 *              Returns the class name according to the layer mode
 *
 * @param {number} mode
 * @return {string}
 * @method
 * @public
 */
export const execute = (mode: LayerModeImpl): string =>
{
    switch (mode) {

        case $MASK_MODE:
            return "timeline-mask-icon";

        case $MASK_IN_MODE:
            return "timeline-mask-in-icon";

        case $GUIDE_MODE:
            return "timeline-guide-icon";

        case $GUIDE_IN_MODE:
            return "timeline-guide-in-icon";

        default:
            return "timeline-layer-icon";

    }
};
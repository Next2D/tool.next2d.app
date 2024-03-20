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

        case 1:
            return "timeline-mask-icon";

        case 2:
            return "timeline-mask-in-icon";

        case 3:
            return "timeline-guide-icon";

        case 4:
            return "timeline-guide-in-icon";

        case 5:
            return "timeline-folder-icon";

        default:
            return "timeline-layer-icon";

    }
};
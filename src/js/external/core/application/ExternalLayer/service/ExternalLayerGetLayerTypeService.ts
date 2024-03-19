import type { LayerModeImpl } from "@/interface/LayerModeImpl";
import type { LayerModeStringImpl } from "@/interface/LayerModeSringImpl";

/**
 * @description レイヤーモードを文字列に変換
 *              Convert layer mode to string
 *
 * @param {number} mode
 * @return {string}
 * @method
 * @public
 */
export const execute = (mode: LayerModeImpl): LayerModeStringImpl =>
{
    switch (mode) {

        case 1:
            return "mask";

        case 2:
            return "mask_in";

        case 3:
            return "guide";

        case 4:
            return "guide_in";

        case 5:
            return "folder";

        default:
            return "normal";

    }
};
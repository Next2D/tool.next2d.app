import type { LayerModeImpl } from "@/interface/LayerModeImpl";
import type { LayerModeStringImpl } from "@/interface/LayerModeSringImpl";

/**
 * @description レイヤのタイプからモードの値を返却
 *              Returns the mode value from the layer type
 *
 * @param  {string} type
 * @return {number}
 * @method
 * @public
 */
export const execute = (type: LayerModeStringImpl): LayerModeImpl =>
{
    switch (type) {

        case "mask":
            return 1;

        case "mask_in":
            return 2;

        case "guide":
            return 3;

        case "guide_in":
            return 4;

        case "folder":
            return 5;

        default:
            return 0;

    }
};
import type { LayerModeImpl } from "@/interface/LayerModeImpl";
import type { LayerModeStringImpl } from "@/interface/LayerModeSringImpl";
import {
    $GUIDE_IN_MODE,
    $GUIDE_MODE,
    $MASK_IN_MODE,
    $MASK_MODE
} from "@/config/LayerModeConfig";

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

        case $MASK_MODE:
            return "mask";

        case $MASK_IN_MODE:
            return "mask_in";

        case $GUIDE_MODE:
            return "guide";

        case $GUIDE_IN_MODE:
            return "guide_in";

        default:
            return "normal";

    }
};
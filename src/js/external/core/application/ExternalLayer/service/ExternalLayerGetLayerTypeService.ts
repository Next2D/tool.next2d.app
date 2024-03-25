import type { LayerModeImpl } from "@/interface/LayerModeImpl";
import type { LayerTypeImpl } from "@/interface/LayerTypeImpl";
import {
    $GUIDE_IN_MODE,
    $GUIDE_IN_TYPE,
    $GUIDE_MODE,
    $GUIDE_TYPE,
    $MASK_IN_MODE,
    $MASK_IN_TYPE,
    $MASK_MODE,
    $MASK_TYPE,
    $NORMAL_TYPE
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
export const execute = (mode: LayerModeImpl): LayerTypeImpl =>
{
    switch (mode) {

        case $MASK_MODE:
            return $MASK_TYPE;

        case $MASK_IN_MODE:
            return $MASK_IN_TYPE;

        case $GUIDE_MODE:
            return $GUIDE_TYPE;

        case $GUIDE_IN_MODE:
            return $GUIDE_IN_TYPE;

        default:
            return $NORMAL_TYPE;

    }
};
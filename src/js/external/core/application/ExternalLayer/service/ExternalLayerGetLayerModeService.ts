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
    $NORMAL_MODE
} from "@/config/LayerModeConfig";

/**
 * @description レイヤのタイプからモードの値を返却
 *              Returns the mode value from the layer type
 *
 * @param  {string} type
 * @return {number}
 * @method
 * @public
 */
export const execute = (type: LayerTypeImpl): LayerModeImpl =>
{
    switch (type) {

        case $MASK_TYPE:
            return $MASK_MODE;

        case $MASK_IN_TYPE:
            return $MASK_IN_MODE;

        case $GUIDE_TYPE:
            return $GUIDE_MODE;

        case $GUIDE_IN_TYPE:
            return $GUIDE_IN_MODE;

        default:
            return $NORMAL_MODE;

    }
};
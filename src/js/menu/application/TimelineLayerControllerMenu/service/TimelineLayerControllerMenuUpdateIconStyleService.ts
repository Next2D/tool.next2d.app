import type { Layer } from "@/core/domain/model/Layer";
import {
    $GUIDE_MODE,
    $MASK_MODE,
    $NORMAL_MODE
} from "@/config/LayerModeConfig";
import {
    $TIMELINE_CONTROLLER_LAYER_NORMAL_ID,
    $TIMELINE_CONTROLLER_LAYER_MASK_ID,
    $TIMELINE_CONTROLLER_LAYER_GUIDE_ID
} from "@/config/TimelineLayerControllerMenuConfig";

/**
 * @description レイヤーのモードに合わせてStyleを更新
 *              Update Style to match layer mode
 *
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    const normalElement: HTMLElement | null = document
        .getElementById($TIMELINE_CONTROLLER_LAYER_NORMAL_ID);

    if (!normalElement) {
        return ;
    }

    const maskElement: HTMLElement | null = document
        .getElementById($TIMELINE_CONTROLLER_LAYER_MASK_ID);

    if (!maskElement) {
        return ;
    }

    const guideElement: HTMLElement | null = document
        .getElementById($TIMELINE_CONTROLLER_LAYER_GUIDE_ID);

    if (!guideElement) {
        return ;
    }

    switch (layer.mode) {

        case $NORMAL_MODE: // NORMAL
            normalElement.setAttribute("style", "opacity:0.5; pointer-events:none;");
            maskElement.setAttribute("style", "");
            guideElement.setAttribute("style", "");
            break;

        case $MASK_MODE: // MASK
            normalElement.setAttribute("style", "");
            maskElement.setAttribute("style", "opacity:0.5; pointer-events:none;");
            guideElement.setAttribute("style", "");
            break;

        case $GUIDE_MODE: // GUIDE
            normalElement.setAttribute("style", "");
            maskElement.setAttribute("style", "");
            guideElement.setAttribute("style", "opacity:0.5; pointer-events:none;");
            break;

        default:
            normalElement.setAttribute("style", "opacity:0.5; pointer-events:none;");
            maskElement.setAttribute("style", "opacity:0.5; pointer-events:none;");
            guideElement.setAttribute("style", "opacity:0.5; pointer-events:none;");
            break;

    }
};
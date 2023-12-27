import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getDisableState } from "../../TimelineUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerControllerUpdateDisableIconStyleService } from "../service/TimelineLayerControllerUpdateDisableIconStyleService";

/**
 * @description 連続した表示機能の処理関数
 *              Processing functions for continuous display functions
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (!$getDisableState()) {
        return ;
    }

    const element: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const layerId = parseInt(element.dataset.layerId as string);
    const scene = $getCurrentWorkSpace().scene;

    const layer: Layer | null = scene.getLayer(layerId);
    if (!layer) {
        return ;
    }

    timelineLayerControllerUpdateDisableIconStyleService(layer.id, !layer.disable);
};
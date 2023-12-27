import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getLockState } from "../../TimelineUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerControllerUpdateLockIconStyleService } from "../service/TimelineLayerControllerUpdateLockIconStyleService";

/**
 * @description 連続したロック機能の処理関数
 *              Processing functions for successive locking functions
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (!$getLockState()) {
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

    timelineLayerControllerUpdateLockIconStyleService(layer.id, !layer.lock);
};
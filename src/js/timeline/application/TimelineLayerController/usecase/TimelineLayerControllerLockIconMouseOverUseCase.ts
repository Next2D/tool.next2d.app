import { $getLayerFromElement, $getLockState } from "../../TimelineUtil";
import { execute as timelineLayerControllerUpdateLockIconStyleService } from "../service/TimelineLayerControllerUpdateLockIconElementService";

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

    // 指定のLayerオブジェクトを取得
    const layer = $getLayerFromElement(element);
    if (!layer) {
        return ;
    }

    layer.lock = !layer.lock;

    timelineLayerControllerUpdateLockIconStyleService(layer.id, layer.lock);
};
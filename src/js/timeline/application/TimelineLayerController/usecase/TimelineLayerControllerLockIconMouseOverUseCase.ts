import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getLayerFromElement, $getLockState } from "../../TimelineUtil";
import { execute as timelineLayerControllerUpdateLockIconStyleService } from "../service/TimelineLayerControllerUpdateLockIconElementService";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

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

    // 外部APIを起動
    const workSpace = $getCurrentWorkSpace();
    const externalLayer = new ExternalLayer(workSpace, workSpace.scene, layer);

    externalLayer.setLock(!layer.lock);

    timelineLayerControllerUpdateLockIconStyleService(layer, layer.lock);
};
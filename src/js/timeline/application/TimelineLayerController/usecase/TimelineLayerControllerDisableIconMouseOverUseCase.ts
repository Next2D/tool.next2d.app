import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getDisableState, $getLayerFromElement } from "../../TimelineUtil";
import { execute as timelineLayerControllerUpdateDisableIconStyleService } from "../service/TimelineLayerControllerUpdateDisableIconElementService";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

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

    // 指定のLayerオブジェクトを取得
    const layer = $getLayerFromElement(element);
    if (!layer) {
        return ;
    }

    // 外部APIを起動
    const workSpace = $getCurrentWorkSpace();
    const externalLayer = new ExternalLayer(workSpace, workSpace.scene, layer);

    // Layerオブジェクトの値を更新
    externalLayer.setDisable(!layer.disable);

    timelineLayerControllerUpdateDisableIconStyleService(layer);
};
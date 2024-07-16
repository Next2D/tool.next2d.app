import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getDisableState, $getLayerFromElement } from "../../TimelineUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

/**
 * @description 連続した表示機能の処理関数
 *              Processing functions for continuous display functions
 *
 * @param  {PointerEvent} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
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
    await externalLayer.setDisable(!layer.disable);
};
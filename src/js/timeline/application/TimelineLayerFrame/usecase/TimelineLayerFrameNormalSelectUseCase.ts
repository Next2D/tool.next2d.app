import { $getLayerFromElement } from "../../TimelineUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 通常のフレームエリア選択の処理関数（Alt、Shiftなし）
 *              Processing function for normal frame area selection (without Alt and Shift)
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    const layer = $getLayerFromElement(element);
    if (!layer) {
        return ;
    }

    // タイムラインのAPIに指定したLayerとフレームを送る
    $getCurrentWorkSpace()
        .getExternalTimeline()
        .setSelectedLayer(
            parseInt(element.dataset.layerIndex as string),
            parseInt(element.dataset.frame as NonNullable<string>)
        );
};
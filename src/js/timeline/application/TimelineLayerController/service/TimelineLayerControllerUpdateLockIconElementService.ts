import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 指定のLayer IDのロック情報を更新して、表示Elementのclassを更新
 *              Update the lock information of the specified Layer ID and update the class of the display Element.
 *
 * @param  {Layer} layer
 * @param  {boolean} lock
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer, lock: boolean): void =>
{
    // 表示領域にElementがなければ終了
    const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!layerElement) {
        return ;
    }

    const element = layerElement
        .querySelector(".timeline-layer-lock-one") as HTMLElement;

    if (!element) {
        return ;
    }

    // update class
    if (lock) {
        element.classList.remove("icon-disable");
        element.classList.add("icon-active");
    } else {
        element.classList.remove("icon-active");
        element.classList.add("icon-disable");
    }
};
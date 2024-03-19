import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 指定のLayer IDの表示・非表示アイコンElementのclassを更新
 *              Update the class of the Show/Hide Icon Element for the specified Layer ID.
 *
 * @param  {Layer} layer
 * @param  {boolean} disable
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer, disable: boolean): void =>
{
    // 表示領域にElementがなければ終了
    const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!layerElement) {
        return ;
    }

    const element = layerElement
        .querySelector(".timeline-layer-disable-one") as HTMLElement;

    if (!element) {
        return ;
    }

    // update class
    if (disable) {
        element.classList.remove("icon-disable");
        element.classList.add("icon-active");
    } else {
        element.classList.remove("icon-active");
        element.classList.add("icon-disable");
    }
};
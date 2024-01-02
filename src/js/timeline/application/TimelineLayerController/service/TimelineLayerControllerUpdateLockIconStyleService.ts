import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 指定のLayer IDのロック情報を更新して、表示Elementのclassを更新
 *              Update the lock information of the specified Layer ID and update the class of the display Element.
 *
 * @param  {number} layer_id
 * @param  {boolean} lock
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number, lock: boolean): void =>
{
    const scene = $getCurrentWorkSpace().scene;
    const layer: Layer | null = scene.getLayer(layer_id);
    if (!layer) {
        return ;
    }

    // 表示領域にElementがなければ終了
    const layerElement = timelineLayer.elements[layer.getDisplayIndex()] as NonNullable<HTMLElement>;
    if (!layerElement) {
        return ;
    }

    const elements = layerElement.getElementsByClassName("timeline-layer-lock-one");
    if (!elements || !elements.length) {
        return ;
    }

    // update property
    const element = elements[0] as NonNullable<HTMLElement>;

    // update class
    if (lock) {
        element.classList.remove("icon-disable");
        element.classList.add("icon-active");
    } else {
        element.classList.remove("icon-active");
        element.classList.add("icon-disable");
    }
};
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 指定のLayer IDの表示・非表示アイコンElementのclassを更新
 *              Update the class of the Show/Hide Icon Element for the specified Layer ID.
 *
 * @param  {number} layer_id
 * @param  {boolean} disable
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number, disable: boolean): void =>
{
    const scene = $getCurrentWorkSpace().scene;
    const layer: Layer | null = scene.getLayer(layer_id);
    if (!layer) {
        return ;
    }

    // 表示領域にElementがなければ終了
    const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!layerElement) {
        return ;
    }

    const elements = layerElement
        .getElementsByClassName("timeline-layer-disable-one");

    if (!elements || !elements.length) {
        return ;
    }

    // update property
    const element = elements[0] as NonNullable<HTMLElement>;

    // update class
    if (disable) {
        element.classList.remove("icon-disable");
        element.classList.add("icon-active");
    } else {
        element.classList.remove("icon-active");
        element.classList.add("icon-disable");
    }
};
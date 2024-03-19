import type { Layer } from "@/core/domain/model/Layer";
import type { LayerModeImpl } from "@/interface/LayerModeImpl";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description レイヤーアイコンの更新
 *              Update layer icon
 *
 * @param  {Layer} layer
 * @param  {number} before_mode
 * @param  {number} after_mode
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    layer: Layer,
    before_mode: LayerModeImpl,
    after_mode: LayerModeImpl
): void => {

    const element: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!element) {
        return ;
    }

    // 現在のclass名を取得
    let beforeClassName = "timeline-layer-icon";
    switch (before_mode) {

        case 1:
            beforeClassName = "timeline-mask-icon";
            break;

        case 2:
            beforeClassName = "timeline-mask-in-icon";
            break;

        case 3:
            beforeClassName = "timeline-guide-icon";
            break;

        case 4:
            beforeClassName = "timeline-guide-in-icon";
            break;

        case 5:
            beforeClassName = "timeline-folder-icon";
            break;

        default:
            beforeClassName = "timeline-layer-icon";
            break;

    }

    // 変更になるclass名を取得
    let afterClassName = "timeline-layer-icon";
    switch (after_mode) {

        case 1:
            afterClassName = "timeline-mask-icon";
            break;

        case 2:
            afterClassName = "timeline-mask-in-icon";
            break;

        case 3:
            afterClassName = "timeline-guide-icon";
            break;

        case 4:
            afterClassName = "timeline-guide-in-icon";
            break;

        case 5:
            afterClassName = "timeline-folder-icon";
            break;

        default:
            afterClassName = "timeline-layer-icon";
            break;

    }

    // 現在のクラス名からElementを取得
    const iconElement = element.querySelector(`.${beforeClassName}`) as HTMLElement;
    if (!iconElement) {
        return ;
    }

    // classを更新
    iconElement.classList.remove(beforeClassName);
    iconElement.classList.add(afterClassName);
};
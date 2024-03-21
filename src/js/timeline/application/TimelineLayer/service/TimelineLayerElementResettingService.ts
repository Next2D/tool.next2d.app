import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description タイムラインの全てのレイヤースタイルから"move-target"を削除する
 *              Remove "move-target" from all layer styles in the timeline
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    const element: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!element) {
        return ;
    }

    // 選択表示のborderを削除
    if (element.classList.contains("move-target")) {
        element.classList.remove("move-target");
    }

    // インサートアイコンを非表示
    const iconElement = element.querySelector(".timeline-insert-icon") as HTMLElement;
    if (iconElement) {
        iconElement.setAttribute("style", "display: none;");
    }
};
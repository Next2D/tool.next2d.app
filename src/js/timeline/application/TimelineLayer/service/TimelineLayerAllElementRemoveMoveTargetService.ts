import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description タイムラインの全てのレイヤースタイルから"move-target"を削除する
 *              Remove "move-target" from all layer styles in the timeline
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    for (let idx = 0; idx < timelineLayer.elements.length; ++idx) {

        const element: HTMLElement | undefined = timelineLayer.elements[idx] as HTMLElement;
        if (!element) {
            continue;
        }

        // styleを削除
        if (!element.classList.contains("move-target")) {
            continue;
        }

        element.classList.remove("move-target");
    }
};
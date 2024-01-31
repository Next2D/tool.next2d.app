import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description タイムラインの全てのレイヤーを非表示にする
 *              Hide all layers in the timeline
 *
 * @param  {number} [index = 0]
 * @return {void}
 * @method
 * @public
 */
export const execute = (index: number = 0): void =>
{
    for (let idx = index; idx < timelineLayer.elements.length; ++idx) {

        const element: HTMLElement | undefined = timelineLayer.elements[idx] as HTMLElement;
        if (!element) {
            continue;
        }

        // 非表示に更新
        element.style.display = "none";
    }
};
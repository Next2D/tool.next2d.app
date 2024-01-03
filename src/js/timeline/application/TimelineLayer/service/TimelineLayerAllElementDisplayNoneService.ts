import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description タイムラインの全てのレイヤーを非表示にする
 *              Hide all layers in the timeline
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

        // 非表示に更新
        element.style.display = "none";

        // アクティブ表示を削除
        element.classList.remove("active");
    }
};
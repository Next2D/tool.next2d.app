import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 指定のLayer IDのハイライトカラーElementを更新、表示領域外の時はスキップ
 *              Update the highlight color Element of the specified Layer ID, skipping when it is outside the display area.
 *
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    // 表示領域にElementがなければ終了
    const element: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!element) {
        return ;
    }

    const lightElement = element
        .querySelector(".timeline-layer-light-one") as HTMLElement;

    if (!lightElement) {
        return ;
    }

    const span = lightElement.children[0] as NonNullable<HTMLElement>;
    span.style.backgroundColor = layer.color;
};